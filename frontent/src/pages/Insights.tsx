import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchUrlData } from "../store/urlSlice";
import { BarChart, LineChart } from "../components/Charts";
import URLInfo from "../components/URLInfo";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { enUS } from "date-fns/locale";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const Insights: React.FC = () => {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const urlData = useSelector((state: RootState) =>
    state.url.urls.find((url) => url.shortUrl === shortUrl),
  );
  const loading = useSelector((state: RootState) => state.url.loading);

  useEffect(() => {
    if (shortUrl) {
      dispatch(fetchUrlData(shortUrl));
    }
  }, [shortUrl, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!urlData) {
    return <div>URL not found</div>;
  }

  const clicksOverTimeArray = Object.keys(urlData.clicksOverTime || {}).map(
    (date) => ({
      date,
      count: urlData.clicksOverTime[date],
    }),
  );

  const clicksOverTimeData = {
    labels: clicksOverTimeArray.map((click) => click.date),
    datasets: [
      {
        label: "Clicks Over Time",
        data: clicksOverTimeArray.map((click) => click.count),
        backgroundColor: "#36a2eb",
      },
    ],
  };

  const countries = urlData.countries || {};
  const countryData = {
    labels: Object.keys(countries),
    datasets: [
      {
        label: "Clicks by Country",
        data: Object.values(countries),
        backgroundColor: "#ff6384",
      },
    ],
  };

  const referrers = urlData.referrers || {};
  const referrerData = {
    labels: Object.keys(referrers),
    datasets: [
      {
        label: "Top Referrers",
        data: Object.values(referrers),
        backgroundColor: "#ffce56",
      },
    ],
  };

  const devices = urlData.devices || {};
  const deviceData = {
    labels: Object.keys(devices),
    datasets: [
      {
        label: "Clicks by Device",
        data: Object.values(devices),
        backgroundColor: "#4dc0b5",
      },
    ],
  };

  const os = urlData.os || {};
  const osData = {
    labels: Object.keys(os),
    datasets: [
      {
        label: "Clicks by OS",
        data: Object.values(os),
        backgroundColor: "#9966ff",
      },
    ],
  };

  const browsers = urlData.browsers || {};
  const browserData = {
    labels: Object.keys(browsers),
    datasets: [
      {
        label: "Clicks by Browser",
        data: Object.values(browsers),
        backgroundColor: "#ff9f40",
      },
    ],
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Insights for {shortUrl}
      </h1>
      <URLInfo
        longUrl={urlData.longUrl}
        shortUrl={urlData.shortUrl}
        createdAt={urlData.createdAt}
      />
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Click Statistics
        </h2>
        <p>Total Clicks: {urlData.totalClicks}</p>
        <p>Unique Visitors: {urlData.uniqueVisitors}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Clicks Over Time
          </h2>
          <div className="w-full max-w-md mx-auto">
            <LineChart
              data={clicksOverTimeData}
              options={{
                scales: {
                  x: {
                    type: "time",
                    time: {
                      unit: "day",
                      tooltipFormat: "PP",
                    },
                    adapters: {
                      date: {
                        locale: enUS,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Clicks by Country
          </h2>
          <div className="w-full max-w-md mx-auto">
            <BarChart data={countryData} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Clicks by Device
          </h2>
          <div className="w-full max-w-md mx-auto">
            <BarChart data={deviceData} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Clicks by OS
          </h2>
          <div className="w-full max-w-md mx-auto">
            <BarChart data={osData} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Clicks by Browser
          </h2>
          <div className="w-full max-w-md mx-auto">
            <BarChart data={browserData} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Top Referrers
          </h2>
          <div className="w-full max-w-md mx-auto">
            <BarChart data={referrerData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
