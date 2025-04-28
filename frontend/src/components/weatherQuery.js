// import { fetchWeatherApi } from 'openmeteo';

export const pollenSources = {
  ALDER: "#228B22",           // 桤木 - 树形
  ASH: "#32CD32",             // 白蜡树 - 树形
  BIRCH: "#ADFF2F",           // 桦木灰 - 树形
  COTTONWOOD: "#66CDAA",      // Cottonwood - 树形
  ELM: "#3CB371",             // Elm - 树形
  MAPLE: "#7CFC00",           // Maple - 树形
  OLIVE: "#6B8E23",           // 橄榄绿 - 树形
  JUNIPER: "#2E8B57",         // Juniper - 树形
  OAK: "#8FBC8F",             // 橡木 - 树形
  PINE: "#20B2AA",            // Pine - 树形
  CYPRESS_PINE: "#008B8B",    // 柏松 - 树形
  HAZEL: "#9ACD32",           // 灰棕色 - 树形
  GRAMINALES: "#FFD700",      // 草类 - 草地
  JAPANESE_CEDAR: "#556B2F",  // 日本雪松 - 树形
  JAPANESE_CYPRESS: "#6B8E23",// 日本柏树 - 树形
  RAGWEED: "#FF6347",         // 豚草 - 杂草
  MUGWORT: "#FF4500"          // 艾蒿 - 杂草
};

export const sourceNames = {
  ALDER: "Tag Alder",           // 桤木 - 树形
  ASH: "Ash Tree",             // 白蜡树 - 树形
  BIRCH: "Birch Ash",           // 桦木灰 - 树形
  COTTONWOOD: "Cottonwood",      // Cottonwood - 树形
  ELM: "Elm",                   // Elm - 树形
  MAPLE: "Maple",               // Maple - 树形
  OLIVE: "Olive Green",           // 橄榄绿 - 树形
  JUNIPER: "Juniper",         // Juniper - 树形
  OAK: "Oak",                  // 橡木 - 树形
  PINE: "Pine",                // Pine - 树形
  CYPRESS_PINE: "Bosong",    // 柏松 - 树形
  HAZEL: "Hazel",           // 灰棕色 - 树形
  GRAMINALES: "Grass",      // 草类 - 草地
  JAPANESE_CEDAR: "Japanese Cedar",  // 日本雪松 - 树形
  JAPANESE_CYPRESS: "Japanese Cypress",// 日本柏树 - 树形
  RAGWEED: "Ragweed",         // 豚草 - 杂草
  MUGWORT: "Mugwort"          // 艾蒿 - 杂草
};


import axios from 'axios';
import {gaussianPlumeAverageConcentration} from './CalculateHeight';
// async function fetchForecastWithLimit(tasks, limit = 10) {
//     const results = [];
//     const executing = [];
  
//     for (const task of tasks) {
//       const p = task().then(result => {
//         results.push(result);
//       });
//       executing.push(p);
  
//       if (executing.length >= limit) {
//         await Promise.race(executing);
//         // 删除已经完成的
//         executing.splice(executing.findIndex(p => p.isFulfilled || p.isRejected), 1);
//       }
//     }
//     await Promise.all(executing);
//     return results;
//   }


export async function fetchForecast(latitude, longitude) {
    // const today = new Date();
    // const tomorrow = new Date();
    // today.setDate(tomorrow.getDate() - 1);

    // const formatDate = (date) => date.toISOString().split('T')[0];

    // const params = {
    //     latitude,
    //     longitude,
    //     start_date: formatDate(today),
    //     end_date: formatDate(tomorrow),
    //     daily: ["temperature_2m_mean", "wind_speed_10m_max", "wind_direction_10m_dominant", "precipitation_sum", "snowfall_sum", "weather_code", "rain_sum"],
    // };
    // const url = "https://archive-api.open-meteo.com/v1/archive";

    // try {
    //     const responses = await fetchWeatherApi(url, params);
    //     const response = responses[0];

    //     const utcOffsetSeconds = response.utcOffsetSeconds();
    //     const daily = response.daily();

    //     const weatherData = {
    //     daily: {
    //         time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
    //         (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
    //         ),
    //         temperature2mMean: daily.variables(0).valuesArray(),
    //         windSpeed10mMax: daily.variables(1).valuesArray(),
    //         windDirection10mDominant: daily.variables(2).valuesArray(),
    //         precipitationSum: daily.variables(3).valuesArray(),
    //         snowfallSum: daily.variables(4).valuesArray(),
    //         weatherCode: daily.variables(5).valuesArray(),
    //         rainSum: daily.variables(6).valuesArray(),
    //     },
    //     };

    //     return weatherData;
    // } catch (error) {
    //     console.error("Error fetching forecast:", error);
    //     return null;
    // }

    const today = new Date();
  const tomorrow = new Date();
  today.setDate(tomorrow.getDate() - 1);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const params = {
    latitude,
    longitude,
    start_date: formatDate(today),
    end_date: formatDate(tomorrow),
    daily: "temperature_2m_mean,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_sum,snowfall_sum,weather_code,rain_sum",
    timezone: "auto",
  };

  const url = "https://archive-api.open-meteo.com/v1/archive";

  try {
    const response = await axios.get(url, { params });
    const data = response.data;

    const daily = data.daily;

    const weatherData = {
      daily: {
        time: daily.time.map((timeStr) => new Date(timeStr)),
        temperature2mMean: daily.temperature_2m_mean,
        windSpeed10mMax: daily.wind_speed_10m_max,
        windDirection10mDominant: daily.wind_direction_10m_dominant,
        precipitationSum: daily.precipitation_sum,
        snowfallSum: daily.snowfall_sum,
        weatherCode: daily.weather_code,
        rainSum: daily.rain_sum,
      },
    };

    return weatherData;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    return null;
  }




  }
  
  export async function fetchPollen(latitude, longitude) {
    try {
        // 模拟 API 返回空的 JSON 数据
        const data = {}; 
    
        console.log("Pollen Data:", data,latitude,longitude);
        return data;
      } catch (error) {
        console.error('Error:', error);
        return null; 
      }
  }



  
export async function samplefetchPollen() {
  // 取所有pollen源名字（key）
  const allSources = Object.keys(pollenSources);

  // 随机决定要几个pollen源（2到5个）
  const count = Math.floor(Math.random() * 4) + 2; // 随机 [2,5]

  const shuffled = allSources.sort(() => 0.5 - Math.random());
  const selectedSources = shuffled.slice(0, count);
  const result = {};
  selectedSources.forEach(source => {
    result[source] = Math.floor(Math.random() * 5) + 1; // 强度[1,5]
  });
  return result;
}


export function createPopupContent(suburbName, pollenData) {
  // 创建区域名称部分
  let popupContent = `
    <div style="color: black; font-size: 14px;">
      <strong>Suburb name:</strong> ${suburbName}<br/>
  `;

  // 遍历pollenData字典
  Object.keys(pollenData).forEach(source => {
    const sourceName = sourceNames[source];
    const strength = pollenData[source];
    const color = pollenSources[source]; // 假设有一个方法返回颜色
    
    // 添加每个pollenData的展示信息
    popupContent += `
      <p><strong>${sourceName}</strong>: ${strength} 
        <span style="display:inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%;"></span>
      </p>
    `;
  });

  // 结束HTML部分
  popupContent += `
    </div>
  `;

  return popupContent;
}

export function updateRectangleBox(totalPollenLevel,pollenHeight, box = null) {
  if (!box) {
    box = document.getElementById('pollen-info-box');
    if (!box) return;  // 如果box不存在就不更新了
  }

  // const pollenHeight = Math.random() * (8 - 6) + 6;
  // const totalPollenLevel = Object.values(pollen).reduce((sum, value) => sum + value, 0);
  const averageConcentration = gaussianPlumeAverageConcentration(totalPollenLevel, 1, 1, 0, pollenHeight);

  box.innerHTML = `
    <strong>Average Pollen Concentration:</strong> ${averageConcentration} µg/m³<br/>
    <strong>Pollen Distribution Height:</strong> ${pollenHeight} meters
  `;
}

export function createRectangleBox(totalPollenLevel,pollenHeight) {
  const box = document.createElement('div');
  box.id = 'pollen-info-box';
  box.style.position = 'absolute';
  box.style.left = '50%';
  box.style.bottom = '20px';
  box.style.transform = 'translateX(-50%)';
  box.style.backgroundColor = 'rgba(0, 0, 255, 0.1)';
  box.style.border = '2px solid #000000';
  box.style.padding = '10px';
  box.style.borderRadius = '5px';
  box.style.zIndex = '1000';

  updateRectangleBox(totalPollenLevel,pollenHeight, box);  // ✅ 创建的时候就填好内容

  document.body.appendChild(box);
}