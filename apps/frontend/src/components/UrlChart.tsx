import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface Url {
  shortUrl: string;
  longUrl: string;
  createdAt: string;
  totalClicks: number;
  uniqueVisitors: number;
}

interface UrlChartProps {
  urls: Url[];
}

const UrlChart: React.FC<UrlChartProps> = ({ urls }) => {
  const data = {
    labels: urls.map((url) => url.shortUrl),
    datasets: [
      {
        label: "Total Clicks",
        data: urls.map((url) => url.totalClicks),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Unique Visitors",
        data: urls.map((url) => url.uniqueVisitors),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "URL Performance",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default UrlChart;
