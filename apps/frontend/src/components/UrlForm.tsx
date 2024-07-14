import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createShortUrl } from "../store/urlSlice";
import { AppDispatch } from "../store/store";
import ShortUrlLink from "./ShortUrlLink";

const UrlForm: React.FC = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const resultAction = await dispatch(createShortUrl(longUrl));
      if (createShortUrl.fulfilled.match(resultAction)) {
        setShortUrl(resultAction.payload.shortUrl);
        setLongUrl("");
      } else {
        throw new Error("Failed to create short URL");
      }
    } catch (error) {
      setError("Error creating short URL. Please try again.");
      console.error("Error creating short URL:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="longUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Long URL
          </label>
          <input
            type="url"
            id="longUrl"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="https://example.com/very/long/url"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Shorten URL
        </button>
      </form>
      {error && <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>}
      {shortUrl && <ShortUrlLink shortUrl={shortUrl} />}
    </div>
  );
};

export default UrlForm;
