import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// A React component to render a dual-axis line chart
// comparing average maximum temperature and average pollen concentration per month
const TempPollenChart = () => {
  // Chart data state
  const [data, setData] = useState([]);

  // Fetch and process data once component is mounted
  useEffect(() => {
    fetch("/data/tem_pollen.json")
      .then(res => res.json())
      .then(json => {
        // Transform raw data to fit chart structure
        const processed = json.map(item => ({
          // Create a label for X-axis using month number
          MonthLabel: `${item.Month}`,
          // Convert temperature value to number
          MaxTemp: Number(item["Maximum temperature (Degree C)"]),
          // Convert pollen average value to number
          PollenAvg: Number(item["Total_Pollen_Avg"])
        }));
        setData(processed);
      })
      .catch(err => {
        console.error("❌ Failed to load tem_pollen.json:", err);
      });
  }, []);

  return (
    <div style={{ margin: "2rem auto", width: "90%" }}>

      {/* Responsive container ensures the chart scales with screen size */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          {/* Adds grid lines to the chart */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* X-axis displays the month label */}
          <XAxis dataKey="MonthLabel" />

          {/* Left Y-axis for temperature data */}
          <YAxis
            yAxisId="left"
            label={{ value: "Max Temp (°C)", angle: -90, position: "insideLeft" }}
            tick={{ fill: "tomato" }} // Tick color matches the line color
          />

          {/* Right Y-axis for pollen data */}
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "Avg Pollen (grains/m³)", angle: 90, position: "insideRight" }}
            tick={{ fill: "green" }}
          />

          {/* Tooltip on hover */}
          <Tooltip />

          {/* Chart legend */}
          <Legend />

          {/* Line for temperature (left Y-axis) */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="MaxTemp"
            stroke="tomato"
            name="Avg Temperature"
            dot={{ r: 4 }} // Add small circles on data points
          />

          {/* Line for pollen concentration (right Y-axis) */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="PollenAvg"
            stroke="green"
            name="Avg Pollen"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TempPollenChart;
