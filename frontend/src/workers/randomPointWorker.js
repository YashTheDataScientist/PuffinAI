
import * as turf from "@turf/turf";

// 接收主线程消息
self.onmessage = (event) => {
  const { feature, numPoints } = event.data;

  if (!feature) {
    console.error("Feature is undefined or null");
    return;
  }

  const points = generateRandomPoints(feature, numPoints);
  self.postMessage({ points });
};

// 随机点生成函数
function generateRandomPoints(feature, numPoints) {
  const points = [];
  const [minLng, minLat, maxLng, maxLat] = turf.bbox(feature);

  while (points.length < numPoints) {
    const lng = Math.random() * (maxLng - minLng) + minLng;
    const lat = Math.random() * (maxLat - minLat) + minLat;
    const colors = ['#ff0000', '#0000ff', '#ffff00', '#00ff00'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];  
    const point = turf.point([lng, lat], { color: randomColor });

    if (turf.booleanPointInPolygon(point, feature)) {
      points.push(point);
    }
  }

  return points;
}