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
        <div>
        <h1 style={{ textAlign: 'center' }}>Live Pollen Map of Victoria</h1>
        <PollenMap />
        </div>

        <div>
        <h1 style={{ textAlign: 'center' }}>Live Pollen Map of Victoria</h1>
        <PollenForecast />
        </div>
        <div>
          <TempPollenChart />
        </div>
        <div>
          <HeatPollenmap />
        </div>
        <div>
          <RainPollenChart />
        </div>
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
