import React, { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Helper array to map month numbers to English abbreviations
const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PollenRainChart = () => {
  const [data, setData] = useState([]);

  // Fetch and format data from local JSON on component mount
  useEffect(() => {
    fetch("/data/rain_pollen.json")
      .then((res) => res.json())
      .then((json) => {
        const formatted = json.map((item) => ({
          // Convert month number to abbreviation
          month: monthMap[item.Month - 1],
          // Ensure numeric types for chart rendering
          Avg_Pollen: Number(item.Total_Pollen_Avg),
          AvgRainfall: Number(item.AvgRainfall),
        }));
        setData(formatted);
      });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data}>
        {/* Background grid lines */}
        <CartesianGrid strokeDasharray="3 3" />
        
        {/* X axis showing month names */}
        <XAxis dataKey="month" />

        {/* Left Y axis for average pollen concentration */}
        <YAxis
          yAxisId="left"
          label={{ value: "Avg Pollen (grains/m³)", angle: -90, position: "insideLeft" }}
          tick={{ fill: "green" }}
        />

        {/* Right Y axis for average rainfall */}
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{ value: "Avg Rainfall (mm)", angle: 90, position: "insideRight" }}
          tick={{ fill: "blue" }}
        />

        {/* Tooltip on hover */}
        <Tooltip />
        
        {/* Legend for identifying data series */}
        <Legend />

        {/* Green bar chart for pollen */}
        <Bar
          yAxisId="left"
          dataKey="Avg_Pollen"
          fill="green"
          name="Avg Pollen"
          barSize={20}
        />

        {/* Blue line chart for rainfall */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="AvgRainfall"
          stroke="blue"
          name="Avg Rainfall"
          dot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default PollenRainChart;
