import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import RecommendationPage from './pages/RecommendationPage';
import LearnPage from './pages/LearnPage';
import CropDetailModal from './components/CropDetailModal';
import NavigationIcon from './components/NavigationIcon';

// Global data shared across components
const globalData = {
  soilCategories: ['clay', 'clay_loam', 'loam', 'sandy_loam', 'sandy', 'well_drained', 'volcanic'],
  crops: [
    'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas',
    'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate',
    'banana', 'mango', 'grapes', 'watermelon', 'muskmelon',
    'apple', 'orange', 'papaya', 'coconut', 'cotton', 'jute', 'coffee'
  ],
  idealConditions: {
    rice: { N: 90, P: 42, K: 43, temp: 27, rain: 200, ph: 5.8, soil: 'clay_loam' },
    maize: { N: 95, P: 40, K: 40, temp: 23, rain: 80, ph: 6.2, soil: 'loam' },
    chickpea: { N: 25, P: 45, K: 45, temp: 20, rain: 70, ph: 6.8, soil: 'sandy_loam' },
    kidneybeans: { N: 25, P: 65, K: 60, temp: 20, rain: 80, ph: 6.8, soil: 'loam' },
    pigeonpeas: { N: 30, P: 45, K: 45, temp: 25, rain: 90, ph: 6.0, soil: 'sandy_loam' },
    mothbeans: { N: 25, P: 45, K: 45, temp: 30, rain: 70, ph: 7.0, soil: 'sandy_loam' },
    mungbean: { N: 30, P: 45, K: 55, temp: 30, rain: 85, ph: 6.8, soil: 'loam' },
    blackgram: { N: 30, P: 45, K: 55, temp: 30, rain: 85, ph: 7.0, soil: 'loam' },
    lentil: { N: 25, P: 45, K: 45, temp: 18, rain: 55, ph: 6.8, soil: 'sandy_loam' },
    pomegranate: { N: 50, P: 45, K: 55, temp: 30, rain: 80, ph: 6.5, soil: 'well_drained' },
    banana: { N: 100, P: 80, K: 90, temp: 27, rain: 200, ph: 6.8, soil: 'clay_loam' },
    mango: { N: 60, P: 50, K: 65, temp: 27, rain: 150, ph: 6.5, soil: 'well_drained' },
    grapes: { N: 60, P: 70, K: 65, temp: 25, rain: 90, ph: 6.3, soil: 'well_drained' },
    watermelon: { N: 60, P: 50, K: 65, temp: 26, rain: 70, ph: 6.5, soil: 'sandy_loam' },
    muskmelon: { N: 60, P: 50, K: 65, temp: 24, rain: 70, ph: 6.5, soil: 'sandy_loam' },
    apple: { N: 55, P: 50, K: 50, temp: 14, rain: 95, ph: 6.3, soil: 'loam' },
    orange: { N: 60, P: 50, K: 65, temp: 24, rain: 180, ph: 6.8, soil: 'well_drained' },
    papaya: { N: 90, P: 50, K: 65, temp: 27, rain: 140, ph: 6.3, soil: 'well_drained' },
    coconut: { N: 90, P: 80, K: 80, temp: 30, rain: 170, ph: 6.5, soil: 'sandy' },
    cotton: { N: 90, P: 70, K: 70, temp: 26, rain: 70, ph: 7.0, soil: 'clay_loam' },
    jute: { N: 90, P: 50, K: 60, temp: 30, rain: 200, ph: 7.0, soil: 'clay_loam' },
    coffee: { N: 60, P: 70, K: 70, temp: 22, rain: 200, ph: 6.3, soil: 'volcanic' }
  },
  cropIcons: {
    rice: '🌾',
    maize: '🌽',
    chickpea: '🌱',
    kidneybeans: '🫘',
    pigeonpeas: '🌿',
    mothbeans: '🍃',
    mungbean: '绿豆',
    blackgram: '🖤',
    lentil: '🫘',
    pomegranate: '🍎',
    banana: '🍌',
    mango: '🥭',
    grapes: '🍇',
    watermelon: '🍉',
    muskmelon: '🍈',
    apple: '🍏',
    orange: '🍊',
    papaya: '🌴',
    coconut: '🥥',
    cotton: '🪡',
    jute: '🧵',
    coffee: '☕'
  },
  featureIcons: {
    N: '🧪',
    P: '🔬',
    K: '💧',
    temperature: '🌡️',
    rainfall: '🌧️',
    ph: '📊',
    soil_type: '🌍'
  }
};

const App = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [inputs, setInputs] = useState({
    N: 90,
    P: 45,
    K: 50,
    temperature: 25,
    rainfall: 180,
    ph: 6.2,
    soil_type: 'loam'
  });
  const [recommendations, setRecommendations] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || value }));
  };

  const calculateSimilarity = (cropName, userInputs) => {
    const ideal = globalData.idealConditions[cropName];
    let score = 0;
    const maxScore = 7;

    const normalize = (val, idealVal, range) => Math.max(0, 1 - Math.abs(val - idealVal) / range);

    score += normalize(userInputs.N, ideal.N, 50);
    score += normalize(userInputs.P, ideal.P, 40);
    score += normalize(userInputs.K, ideal.K, 40);
    score += normalize(userInputs.temperature, ideal.temp, 15);
    score += normalize(userInputs.rainfall, ideal.rain, 100);
    score += normalize(userInputs.ph, ideal.ph, 2);
    if (userInputs.soil_type === ideal.soil) score += 1;

    return score / maxScore;
  };

  const getRecommendations = () => {
    const similarities = globalData.crops.map(crop => ({
      crop,
      similarity: calculateSimilarity(crop, inputs),
      icon: globalData.cropIcons[crop]
    }));

    const sorted = [...similarities].sort((a, b) => b.similarity - a.similarity);
    
    return sorted.slice(0, 5).map(item => ({
      crop: item.crop,
      confidence: `${(item.similarity * 100).toFixed(1)}%`,
      suitability: item.similarity > 0.7 ? 'Excellent' : item.similarity > 0.5 ? 'Good' : 'Moderate',
      icon: item.icon,
      similarity: item.similarity
    }));
  };

  useEffect(() => {
    setRecommendations(getRecommendations());
  }, [inputs]);

  const handleRecommend = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
  };

  // Handle hash changes for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash === 'recommend') setCurrentSection('recommend');
      else if (hash === 'learn') setCurrentSection('learn');
      else setCurrentSection('home');
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-4xl mr-3">🌾</div>
              <h1 className="text-2xl font-bold text-gray-800">AgriAI</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => {
                  setCurrentSection('home');
                  window.location.hash = '#home';
                }} 
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${currentSection === 'home' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:text-green-600'}`}
              >
                Home
              </button>
              <button 
                onClick={() => {
                  setCurrentSection('recommend');
                  window.location.hash = '#recommend';
                }} 
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${currentSection === 'recommend' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:text-green-600'}`}
              >
                Recommend
              </button>
              <button 
                onClick={() => {
                  setCurrentSection('learn');
                  window.location.hash = '#learn';
                }} 
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${currentSection === 'learn' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:text-green-600'}`}
              >
                Learn
              </button>
            </nav>
            <div className="md:hidden">
              <button 
                onClick={() => {
                  const newSection = currentSection === 'home' ? 'recommend' : 'home';
                  setCurrentSection(newSection);
                  window.location.hash = newSection === 'recommend' ? '#recommend' : '#home';
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium"
              >
                {currentSection === 'home' ? 'Recommend' : 'Home'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex justify-around">
          <NavigationIcon 
            icon="🏠" 
            label="Home" 
            isActive={currentSection === 'home'} 
            onClick={() => {
              setCurrentSection('home');
              window.location.hash = '#home';
            }} 
          />
          <NavigationIcon 
            icon="🎯" 
            label="Recommend" 
            isActive={currentSection === 'recommend'} 
            onClick={() => {
              setCurrentSection('recommend');
              window.location.hash = '#recommend';
            }} 
          />
          <NavigationIcon 
            icon="📚" 
            label="Learn" 
            isActive={currentSection === 'learn'} 
            onClick={() => {
              setCurrentSection('learn');
              window.location.hash = '#learn';
            }} 
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-2 pb-20">
        {currentSection === 'home' && <HomePage />}
        {currentSection === 'recommend' && (
          <RecommendationPage 
            inputs={inputs}
            setInputs={setInputs}
            recommendations={recommendations}
            setRecommendations={setRecommendations}
            showChart={showChart}
            setShowChart={setShowChart}
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            handleInputChange={handleInputChange}
            handleRecommend={handleRecommend}
            globalData={globalData}
          />
        )}
        {currentSection === 'learn' && <LearnPage />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="mb-4">© 2025 AgriAI - Advanced Crop Recommendation System</p>
          <p className="text-gray-400 text-sm">
            Powered by machine learning • No data stored • All processing in-browser
          </p>
        </div>
      </footer>

      {/* Crop Detail Modal */}
      <CropDetailModal 
        selectedCrop={selectedCrop} 
        setSelectedCrop={setSelectedCrop} 
        idealConditions={globalData.idealConditions}
        cropIcons={globalData.cropIcons}
        crops={globalData.crops}
      />

      {/* Global Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default App;
