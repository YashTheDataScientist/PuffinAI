import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import HomePage from './pages/HomePage';
import PollenPage from './pages/PollenPage';
import PlantPage from './pages/PlantIdentifyPage';
import PasswordPage from './pages/PasswordPage';
import TestPlantIdentifyPage from './pages/PlantIdentifyPage';
import ProtectedRoute from './components/ProtectedRoute';
import Country from './components/CountryMap';
import StateMap from './components/StateMap';
import CityMap from './components/CityMap';
import SymptomsPage from './pages/SymptomPage';
import LearnAboutPollen from './pages/LearnAboutPollen';
import KnowYourArea from './pages/KnowYourArea';
import AsthmaPage from './pages/AsthmaPage';
import './App.css'; 
import Popup from './components/Popup';
import AllergyGuide from './pages/AllergyGuide';
import FeatureLookup from './components/FeatureLookup';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import VoiceCommand from './components/VoiceCommand';
import AlexaPopup from './components/AlexaPopup'; 

function App() {
  return (
    <div className="app-container"> {}
      <Navbar />
      
      <AlexaPopup />
      <div className="main-content"> {}
        <Routes>
          <Route path="/auth" element={<HomePage />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/pollen_watch" element={<ProtectedRoute><PollenPage /></ProtectedRoute>} />
          <Route path="/know_your_plants" element={<ProtectedRoute><PlantPage /></ProtectedRoute>} />
          <Route path="/know_your_area" element={<ProtectedRoute><KnowYourArea /></ProtectedRoute>} />
          <Route path="/learn" element={<ProtectedRoute><LearnAboutPollen /></ProtectedRoute>} />
          <Route path="/plant_identify" element={<ProtectedRoute><TestPlantIdentifyPage /></ProtectedRoute>} />
          <Route path="/symptoms" element={<ProtectedRoute><SymptomsPage /></ProtectedRoute>} />
          <Route path="/country" element={<ProtectedRoute><Country /></ProtectedRoute>} />
          <Route path="/country/:stateName" element={<ProtectedRoute><StateMap /></ProtectedRoute>} />
          <Route path="/country/:stateName/:cityName" element={<ProtectedRoute><CityMap /></ProtectedRoute>} />
          <Route path="/asthma_info" element={<ProtectedRoute><AsthmaPage /></ProtectedRoute>} />


          <Route
            path="/allergy-guide"
            element={
              <ProtectedRoute>
                <AllergyGuide />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>
      <FeatureLookup />
      <AccessibilityToolbar />
      <VoiceCommand />
      <Footer />
    </div>
  );
}

export default App;
