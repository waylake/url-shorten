import React from "react";
import { Link } from "react-router-dom";

interface ShortUrlLinkProps {
  shortUrl: string;
}

const ShortUrlLink: React.FC<ShortUrlLinkProps> = ({ shortUrl }) => {
  const baseUrl = import.meta.env.VITE_SHORT_URL_BASE;
  const fullUrl = `${baseUrl}/${shortUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <p className="text-gray-700 dark:text-gray-300 mb-2">
        Your shortened URL:
      </p>
      <div className="flex items-center">
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline mr-2 break-all"
        >
          {fullUrl}
        </a>
        <button
          onClick={copyToClipboard}
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Copy
        </button>
        <Link
          to={`/insights/${shortUrl}`}
          className="ml-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          View Insights
        </Link>
      </div>
    </div>
  );
};

export default ShortUrlLink;
