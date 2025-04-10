// import SubscribeForm from '../components/SubscribeForm';
// import MailSVG from '../assets/email-campaign-animate.svg';
// import './PollenPage.css';
// import PollenMap from '../components/PollenMap';

// import PollenForecast from "../components/PollenForecast";
// import TempPollenChart from '../components/TempPollenChart';
// import HeatPollenmap from '../components/HeatPollenmap';
// import RainPollenChart from '../components/RainPollenChart';



// export default function PollenPage() {
//   return (
//     <>
//         <div style={{ marginTop: '120px', color: '#333' }}>
//         <h1 style={{ textAlign: 'center' }}>Live Pollen Map of Victoria</h1>
//         <PollenMap />
//         </div>

//         <div>
//         <h1 style={{ textAlign: 'center' }}>Live Pollen Map of Victoria</h1>
//         <PollenForecast />
//         </div>
//         <div>
//           <TempPollenChart />
//         </div>
//         <div>
//           <HeatPollenmap />
//         </div>
//         <div>
//           <RainPollenChart />
//         </div>
//         <div className="subscribe-section">
//         <div className="subscribe-content">
//             <div className="subscribe-text">
//             <h2>Want pollen forecasts at your fingertips?</h2>
//             <p>
//                 Stay informed with daily updates tailored for Melbourne. Just drop your email
//                 below and we’ll keep you one step ahead of allergies — every day, no spam.
//             </p>
//             <SubscribeForm />
//             </div>
//             <div className="subscribe-image">
//             <img src={MailSVG} alt="Subscribe illustration" />
//             </div>
//         </div>
//         </div>
//     </>
//   );
// }



import SubscribeForm from '../components/SubscribeForm';
import MailSVG from '../assets/email-campaign-animate.svg';
import './PollenPage.css';
import PollenMap from '../components/PollenMap';
import PollenForecast from "../components/PollenForecast";
import TempPollenChart from '../components/TempPollenChart';
import HeatPollenmap from '../components/HeatPollenmap';
import RainPollenChart from '../components/RainPollenChart';

export default function PollenPage() {
  return (
    <>
      {/* SECTION 1: LIVE POLLEN MAP */}
      <div className="live-map-wrapper">
        <div className="map-column">
          <h1 className="section-heading">Live Pollen Map of Victoria</h1>
          <PollenMap />
        </div>
        <div className="map-description">
          <h2>How to read the map?</h2>
          <p>
            This live interactive map displays pollen levels across Victoria. The regions are color-coded based on the <strong>Universal Pollen Index (UPI)</strong>:
          </p>
          <ul>
            <li><strong style={{ color: '#4caf50' }}>Green</strong>: Very Low Pollen</li>
            <li><strong style={{ color: '#cddc39' }}>Yellow</strong>: Low</li>
            <li><strong style={{ color: '#ff9800' }}>Orange</strong>: Moderate</li>
            <li><strong style={{ color: '#f44336' }}>Red</strong>: High to Extreme</li>
          </ul>
          <p>
            Use this tool to plan outdoor activities and avoid allergy hotspots in real-time.
          </p>
        </div>
      </div>

      {/* SECTION 2: POLLEN FORECAST */}
      <div className="live-map-wrapper">
        <div className="map-column">
          <h1 className="section-heading">5-Day Pollen Forecast</h1>
          <PollenForecast />
        </div>
        <div className="map-description">
          <h2>Why it matters</h2>
          <p>
            The 5-day forecast helps you plan ahead based on predicted pollen levels in your area. Each day's data includes:
          </p>
          <ul>
            <li>Tree, grass, and weed pollen levels</li>
            <li>Temperature, wind, humidity</li>
            <li>General allergy risk index</li>
          </ul>
          <p>
            This information is essential for people with asthma, hay fever, or other respiratory issues.
          </p>
        </div>
      </div>

      {/* SECTION 3: TEMP + POLLEN RELATIONSHIP */}
      <div className="live-map-wrapper">
        <div className="map-column">
          <h1 className="section-heading">Monthly Temperature vs Pollen Levels</h1>
          <TempPollenChart />
        </div>
        <div className="map-description">
          <h2>What this shows</h2>
          <p>
            This chart explores how temperature impacts pollen concentration throughout the year. 
            You’ll typically notice:
          </p>
          <ul>
            <li>Pollen spikes in spring & early summer</li>
            <li>Temperature rises before pollen does</li>
            <li>High pollen persists until temperature drops</li>
          </ul>
          <p>
            It's a strong indicator of seasonal triggers for allergy sufferers.
          </p>
        </div>
      </div>

      {/* SECTION 4: HEATMAP */}
      <div className="live-map-wrapper">
        <div className="map-column">
          <h1 className="section-heading">Pollen Heatmap (2024)</h1>
          <HeatPollenmap />
        </div>
        <div className="map-description">
          <h2>Why it's useful</h2>
          <p>
            This heatmap visualizes the average monthly pollen concentration using color intensity. 
            Darker shades represent higher exposure. You can quickly:
          </p>
          <ul>
            <li>Spot high-risk months (e.g. Oct–Nov)</li>
            <li>Compare seasonal variation</li>
            <li>Plan protective measures accordingly</li>
          </ul>
        </div>
      </div>

      {/* SECTION 5: RAINFALL VS POLLEN */}
      <div className="live-map-wrapper">
        <div className="map-column">
          <h1 className="section-heading">Rainfall vs Pollen Levels</h1>
          <RainPollenChart />
        </div>
        <div className="map-description">
          <h2>Interesting insights</h2>
          <p>
            Rain can both suppress and trigger pollen dispersal. This dual-axis chart shows:
          </p>
          <ul>
            <li>Months with low rainfall often have higher pollen</li>
            <li>Heavy rain can clear the air temporarily</li>
            <li>Light rain may increase airborne allergens</li>
          </ul>
        </div>
      </div>

      {/* SECTION 6: SUBSCRIBE */}
      <div className="subscribe-section">
        <div className="subscribe-content">
          <div className="subscribe-text">
            <h2>Want pollen forecasts at your fingertips?</h2>
            <p>
              Stay informed with daily updates tailored for Melbourne. Just drop your email
              below and we’ll keep you one step ahead of allergies — every day, no spam.
            </p>
            <SubscribeForm />
          </div>
          <div className="subscribe-image">
            <img src={MailSVG} alt="Subscribe illustration" />
          </div>
        </div>
      </div>
    </>
  );
}
