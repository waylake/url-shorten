import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { ChartData, ChartOptions, ChartEvent } from "chart.js";

interface BarChartProps {
  data: ChartData<"bar">;
  options?: ChartOptions<"bar">;
}

const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  const onClick = (_: ChartEvent, elements: any) => {
    if (elements.length > 0) {
      const { index } = elements[0];
      if (data.labels && index !== undefined) {
      }
    }
  };

  return <Bar data={data} options={{ ...options, onClick }} />;
};

interface PieChartProps {
  data: ChartData<"pie">;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const onClick = (_: ChartEvent, elements: any) => {
    if (elements.length > 0) {
      const { index } = elements[0];
      if (data.labels && index !== undefined) {
      }
    }
  };

  return <Pie data={data} options={{ onClick }} />;
};

interface LineChartProps {
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
}

const LineChart: React.FC<LineChartProps> = ({ data, options }) => {
  const onClick = (_: ChartEvent, elements: any) => {
    if (elements.length > 0) {
      const { index } = elements[0];
      if (data.labels && index !== undefined) {
      }
    }
  };

  return <Line data={data} options={{ ...options, onClick }} />;
};

export { BarChart, PieChart, LineChart };
