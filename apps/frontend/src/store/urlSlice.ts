import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getUserUrls as getUserUrlsApi,
  createShortUrl as createShortUrlApi,
  getUrlData as getUrlDataApi,
} from "../api/urlApi";
import { RootState } from "./store";

interface ClickOverTime {
  [date: string]: number;
}

interface Url {
  shortUrl: string;
  longUrl: string;
  createdAt: string;
  totalClicks: number;
  uniqueVisitors: number;
  clicksOverTime: ClickOverTime;
  countries: { [key: string]: number };
  browsers: { [key: string]: number };
  os: { [key: string]: number };
  devices: { [key: string]: number };
  referrers: { [key: string]: number };
  geoData: any[];
}

interface UrlState {
  urls: Url[];
  currentPage: number;
  totalPages: number;
  totalUrls: number;
  loading: boolean;
  error: string | null;
}

const initialState: UrlState = {
  urls: [],
  currentPage: 1,
  totalPages: 1,
  totalUrls: 0,
  loading: false,
  error: null,
};

export const fetchUserUrls = createAsyncThunk<
  UrlState,
  void,
  { state: RootState }
>("url/fetchUserUrls", async () => {
  const response = await getUserUrlsApi();
  return response;
});

export const createShortUrl = createAsyncThunk<
  Url,
  string,
  { state: RootState }
>("url/createShortUrl", async (longUrl) => {
  const response = await createShortUrlApi(longUrl);
  return response;
});

export const fetchUrlData = createAsyncThunk<Url, string, { state: RootState }>(
  "url/fetchUrlData",
  async (shortUrl) => {
    const response = await getUrlDataApi(shortUrl);
    return response;
  },
);

const urlSlice = createSlice({
  name: "url",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserUrls.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchUserUrls.fulfilled,
        (state, action: PayloadAction<UrlState>) => {
          state.loading = false;
          state.urls = action.payload.urls;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
          state.totalUrls = action.payload.totalUrls;
        },
      )
      .addCase(fetchUserUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch URLs";
      })
      .addCase(
        createShortUrl.fulfilled,
        (state, action: PayloadAction<Url>) => {
          state.urls.unshift(action.payload);
        },
      )
      .addCase(fetchUrlData.fulfilled, (state, action: PayloadAction<Url>) => {
        const existingUrl = state.urls.find(
          (url) => url.shortUrl === action.payload.shortUrl,
        );
        if (!existingUrl) {
          state.urls.push(action.payload);
        } else {
          // If the URL already exists, update it with the new data
          Object.assign(existingUrl, action.payload);
        }
      });
  },
});

export default urlSlice.reducer;
