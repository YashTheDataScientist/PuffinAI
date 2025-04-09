import React from "react";
import ReactECharts from "echarts-for-react";

const HeatPollenmap = () => {
  // Labels for the X-axis representing each month of the year
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Monthly average pollen concentration values for the year 2024
  const data2024 = [
    149.88, 40.8, 14.88, 25.93, 32.98, 42.08,
    28.05, 1135.94, 762.03, 1917.94, 2679.63, 1366.80
  ];

  // Convert monthly data into a format suitable for ECharts heatmap series:
  // [xIndex (month), yIndex (only one row), value]
  const heatmapData = months.map((_, i) => [i, 0, data2024[i]]);

  // Configuration object for the ECharts heatmap visualization
  const option = {
    tooltip: {
      // Position tooltip above the hovered cell
      position: "top",
      // Display month and pollen value in the tooltip
      formatter: (p) => `${months[p.data[0]]}: ${p.data[2]} grains/m³`,
    },
    xAxis: {
      type: "category",           // X-axis is categorical (not numeric)
      data: months,               // Use month labels as categories
      axisLabel: { rotate: 0 },   // Keep labels horizontal
    },
    yAxis: {
      type: "category",           // Y-axis is also categorical
      data: ["2024"],             // Single row labeled "2024"
      splitArea: { show: true },  // Show background grid area behind cells
    },
    visualMap: {
      min: 0,                     // Minimum value for color scaling
      max: 2700,                  // Maximum value for color scaling
      calculable: true,          // Enables drag handles on the color legend
      orient: "horizontal",      // Layout direction of the legend
      left: "center",
      bottom: "5%",
      inRange: {
        // Color gradient for the heatmap values: low (blue) to high (red)
        color: ["#d2e9ff", "#2b7ec1", "#f44336"],
      },
    },
    series: [
      {
        name: "Pollen",
        type: "heatmap",         // This chart is a heatmap
        data: heatmapData,       // Use the converted [x, y, value] format
        label: {
          show: true,            // Show the numeric value inside each cell
          formatter: "{@[2]}",   // Access the value from the data array
          color: "#000",         // Black text for maximum contrast
          fontWeight: "bold",    // Bold font to improve readability
        },
        emphasis: {
          // Add a soft shadow to the cell when hovered
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  // Render the heatmap chart inside a container with fixed height
  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ReactECharts option={option} style={{ height: "100%" }} />
    </div>
  );
};

export default HeatPollenmap;
