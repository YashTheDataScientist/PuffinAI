import PlantIdentifier from '../components/PlantIdentifier';
import PlantCarousel from '../components/PlantCarousel';
import SeasonalPolLenTips from '../components/SeasonalPolLenTips';
import HouseTips from '../components/HouseTips';
const TestPlantIdentifyPage = () => {
  return (
    <div style={{ marginTop: '5rem', padding: '2rem' }}>
      <PlantIdentifier />
      <PlantCarousel />
      <SeasonalPolLenTips />
      <HouseTips />
    </div>
    
  );
};

export default TestPlantIdentifyPage;
