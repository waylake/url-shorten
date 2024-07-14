import React from "react";

interface URLInfoProps {
  longUrl: string;
  shortUrl: string;
  createdAt: string;
}

const URLInfo: React.FC<URLInfoProps> = ({ longUrl, shortUrl, createdAt }) => {
  const baseUrl = import.meta.env.VITE_SHORT_URL_BASE;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        URL Information
      </h2>
      <table className="min-w-full text-left text-gray-800 dark:text-gray-200">
        <tbody>
          <tr>
            <td className="py-2 font-medium">Original URL:</td>
            <td className="py-2">{longUrl}</td>
          </tr>
          <tr>
            <td className="py-2 font-medium">Short URL:</td>
            <td className="py-2">
              {baseUrl}/{shortUrl}
            </td>
          </tr>
          <tr>
            <td className="py-2 font-medium">Created At:</td>
            <td className="py-2">{new Date(createdAt).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default URLInfo;
