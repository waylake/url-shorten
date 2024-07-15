import { Request, Response } from "express";
import shortid from "shortid";
import { Url, IClick } from "../models/Url";
import requestIp from "request-ip";
import axios from "axios";
import UAParser from "ua-parser-js";

const GEOLOCATION_API_URL =
  "https://nordvpn.com/wp-admin/admin-ajax.php?action=get_user_info_data&ip=";

interface GeoData {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  ip: string;
  isp: string;
  host: {
    ip_address: string;
    prefix_len: number;
  };
  status: boolean;
  country: string;
  region: string;
  city: string;
  location: string;
  area_code: string;
  country_code: string;
}

export const createShortUrl = async (req: Request, res: Response) => {
  try {
    const { longUrl, customCode } = req.body;
    const userId = (req as any).userId;

    let shortUrl = customCode || shortid.generate();

    if (customCode) {
      const existingUrl = await Url.findOne({ shortUrl });
      if (existingUrl) {
        return res.status(400).json({ message: "Custom code already in use" });
      }
    }

    const url = new Url({ longUrl, shortUrl, userId });
    await url.save();
    res.json({ shortUrl });
  } catch (error) {
    res.status(500).json({ message: "Error creating short URL" });
  }
};

export const redirectToLongUrl = async (req: Request, res: Response) => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    const clientIp = requestIp.getClientIp(req) || "";
    const userAgent = req.get("User-Agent") || "";
    const referer = req.get("Referer") || "";
    const parser = new UAParser(userAgent);
    const browserName = parser.getBrowser().name || "Unknown";
    const osName = parser.getOS().name || "Unknown";
    const deviceType = parser.getDevice().type || "desktop";

    let country, city, latitude, longitude;

    if (clientIp) {
      const geoResponse = await axios.get(`${GEOLOCATION_API_URL}${clientIp}`);
      const geoData = geoResponse.data as GeoData;

      country = geoData.country;
      city = geoData.city;
      latitude = geoData.coordinates.latitude;
      longitude = geoData.coordinates.longitude;
    }

    const clickData: IClick = {
      ip: clientIp,
      userAgent,
      referer,
      timestamp: new Date(),
      country,
      city,
      latitude,
      longitude,
      browser: browserName,
      os: osName,
      device: deviceType,
    };

    url.clicks.push(clickData);
    await url.save();
    res.redirect(url.longUrl);
  } catch (error) {
    res.status(500).json({ message: "Error redirecting to long URL" });
  }
};

export const getUrlStats = async (req: Request, res: Response) => {
  try {
    const { shortUrl } = req.params;
    const userId = (req as any).userId;
    const url = await Url.findOne({ shortUrl, userId });
    if (!url) {
      return res.status(404).json({ message: "URL not found or unauthorized" });
    }

    const clicksOverTime = getClicksOverTime(url.clicks);
    const stats = {
      totalClicks: url.clicks.length,
      longUrl: url.longUrl,
      shortUrl: url.shortUrl,
      createdAt: url.createdAt,
      uniqueVisitors: new Set(
        url.clicks
          .map((click) => click.ip)
          .filter((ip): ip is string => ip !== undefined),
      ).size,
      countries: countOccurrences(
        url.clicks
          .map((click) => click.country)
          .filter((country): country is string => country !== undefined),
      ),
      browsers: countOccurrences(
        url.clicks
          .map((click) => click.browser)
          .filter((browser): browser is string => browser !== undefined),
      ),
      os: countOccurrences(
        url.clicks
          .map((click) => click.os)
          .filter((os): os is string => os !== undefined),
      ),
      devices: countOccurrences(
        url.clicks
          .map((click) => click.device)
          .filter((device): device is string => device !== undefined),
      ),
      referrers: countOccurrences(
        url.clicks
          .map((click) => click.referer)
          .filter((referer): referer is string => referer !== undefined)
          .map(getDomain)
          .filter((domain): domain is string => domain !== undefined),
      ),
      clicksOverTime,
      geoData: url.clicks
        .filter(
          (click): click is IClick & { latitude: number; longitude: number } =>
            click.latitude !== undefined && click.longitude !== undefined,
        )
        .map((click) => ({
          lat: click.latitude,
          lng: click.longitude,
          count: 1,
        })),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching URL stats" });
  }
};

export const getUserUrls = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const totalUrls = await Url.countDocuments({ userId });
    const totalPages = Math.ceil(totalUrls / limit);

    const urls = await Url.find({ userId })
      .select("shortUrl longUrl createdAt clicks")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const urlStats = urls.map((url) => ({
      shortUrl: url.shortUrl,
      longUrl: url.longUrl,
      createdAt: url.createdAt,
      totalClicks: url.clicks.length,
      uniqueVisitors: new Set(url.clicks.map((click) => click.ip)).size,
    }));

    res.json({
      urls: urlStats,
      currentPage: page,
      totalPages,
      totalUrls,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user URLs" });
  }
};

export const deleteUrl = async (req: Request, res: Response) => {
  try {
    const { shortUrl } = req.params;
    const userId = (req as any).userId;

    const url = await Url.findOneAndDelete({ shortUrl, userId });
    if (!url) {
      return res.status(404).json({ message: "URL not found or unauthorized" });
    }

    res.json({ message: "URL deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting URL" });
  }
};

// Utility functions
function countOccurrences(arr: string[]): Record<string, number> {
  return arr.reduce(
    (acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

function getDomain(url: string): string | undefined {
  try {
    const domain = new URL(url).hostname;
    return domain.startsWith("www.") ? domain.slice(4) : domain;
  } catch {
    return undefined;
  }
}

function getClicksOverTime(clicks: any[]): Record<string, number> {
  const clicksByDay = clicks.reduce(
    (acc, click) => {
      const date = new Date(click.timestamp).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Fill in missing days with zero clicks
  const sortedDays = Object.keys(clicksByDay).sort();
  if (sortedDays.length > 1) {
    const start = new Date(sortedDays[0]);
    const end = new Date(sortedDays[sortedDays.length - 1]);
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const day = d.toISOString().split("T")[0];
      if (!clicksByDay[day]) {
        clicksByDay[day] = 0;
      }
    }
  }

  return clicksByDay;
}
