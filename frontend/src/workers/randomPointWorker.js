
import * as turf from "@turf/turf";
import { pollenSources } from '../components/weatherQuery';
// 接收主线程消息
self.onmessage = (event) => {
  const { feature, numPoints,pollenData } = event.data;

  if (!feature) {
    console.error("Feature is undefined or null");
    return;
  }

  const points = generateRandomPoints(feature, numPoints,pollenData);
  self.postMessage({ points });
};

// 随机点生成函数
function generateRandomPoints(feature, numPoints,pollenData) {
  const points = [];
  const [minLng, minLat, maxLng, maxLat] = turf.bbox(feature);
  let colors = [];
  Object.keys(pollenData).forEach((source) => {
    console.log("看下颜色数据",pollenData);
    const color = pollenSources[source]; 
    const intensity = pollenData[source];
    colors = colors.concat(Array(intensity).fill(color));
  });
  while (points.length < numPoints) {
    const lng = Math.random() * (maxLng - minLng) + minLng;
    const lat = Math.random() * (maxLat - minLat) + minLat;
    // const colors = ['#ff0000', '#0000ff', '#ffff00', '#00ff00'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];  
    const point = turf.point([lng, lat], { color: randomColor });

    if (turf.booleanPointInPolygon(point, feature)) {
      points.push(point);
    }
  }

  return points;
}