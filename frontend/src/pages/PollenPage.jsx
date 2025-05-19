
import SubscribeForm from '../components/SubscribeForm';
import MailSVG from '../assets/email-campaign-animate.svg';
import './PollenPage.css';
import PollenMap from '../components/PollenMap';
import PollenForecast from "../components/PollenForecast";
import TempPollenChart from '../components/TempPollenChart';
import HeatPollenmap from '../components/HeatPollenmap';
import RainPollenChart from '../components/RainPollenChart';
import SeasonBanner from '../components/PollenInfoCards';


export default function PollenPage() {
  return (
    <>
    

      {/* SECTION 1: LIVE POLLEN MAP */}
      <div className="live-map-wrapper">
  <div className="map-column">
 
    <h1 className="section-heading">Live Pollen Map of Victoria</h1>
    <PollenMap />
    
  </div>
  <SeasonBanner status="off-season" />
</div>

      <hr className="section-divider" />


     


      {/* SECTION 4: HEATMAP
      <div className="map-section">
  <div className="live-map-wrapper">
    <div className="map-column">
      <div className="map-card">
        <HeatPollenmap />
      </div>
    </div>
    <div className="map-description">
      <h2>Pollen Heatmap Insights</h2>
      <p>
        This heatmap illustrates how pollen levels vary month-to-month across the year.
        Pollen exposure peaks in October and November, making these the most high-risk periods for allergy sufferers.
        Levels are lowest during winter (June to August), offering some seasonal relief.
        These trends help reveal when symptoms are most likely to flare up.
      </p>
    </div>
  </div>
</div> */}




 {/* SECTION 4: TEMP VS POLLEN */}
{/* <div className="map-section">
  <div className="live-map-wrapper">
    <div className="map-column">
      <TempPollenChart />
    </div>
    <div className="map-description">
      <h2>How Temperature Affects Pollen</h2>
      <p>
        Warmer temperatures lead to more pollen in the air — but not instantly.
        In early spring, temperature begins to rise before pollen does. As heat builds up, plants enter their pollination phase, 
        leading to a sharp spike in pollen levels during October and November.
        Interestingly, even when temperatures start dropping, pollen may remain high for a while, showing a lag in response. 
        Understanding this pattern helps predict allergy risks before symptoms begin.
      </p>
    </div>
  </div>
</div> */}



{/* SECTION 5: RAINFALL VS POLLEN */}
{/* <div className="map-section">
  <div className="live-map-wrapper">
    <div className="map-column">
      <RainPollenChart />
    </div>
    <div className="map-description">
      <h2>How Rainfall Influences Pollen</h2>
      <p>
        Rain affects pollen in different ways depending on how much and when it falls.
        In dry months like September and October, pollen levels tend to rise as nothing holds them down.
        A burst of heavy rain can clear pollen from the air, but light rain or post-rain humidity can actually increase airborne allergens.
        The relationship is complex — low rainfall months often align with high allergy risk, while brief wet spells may offer short-term relief.
      </p>
    </div>
  </div>
</div> */}



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
    </>
  );
}
