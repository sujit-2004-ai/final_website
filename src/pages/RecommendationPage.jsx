import React, { useState, useEffect } from 'react';
import CropCard from '../components/CropCard';
import FeatureBar from '../components/FeatureBar';
import StatCard from '../components/StatCard';

const RecommendationPage = () => {
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

  const soilCategories = ['clay', 'clay_loam', 'loam', 'sandy_loam', 'sandy', 'well_drained', 'volcanic'];

  const crops = [
    'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas',
    'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate',
    'banana', 'mango', 'grapes', 'watermelon', 'muskmelon',
    'apple', 'orange', 'papaya', 'coconut', 'cotton', 'jute', 'coffee'
  ];

  // Ideal values for each crop (from your dataset)
  const idealConditions = {
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
  };

  const cropIcons = {
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
  };

  const featureIcons = {
    N: '🧪',
    P: '🔬',
    K: '💧',
    temperature: '🌡️',
    rainfall: '🌧️',
    ph: '📊',
    soil_type: '🌍'
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || value }));
  };

  const calculateSimilarity = (cropName, userInputs) => {
    const ideal = idealConditions[cropName];
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
    const similarities = crops.map(crop => ({
      crop,
      similarity: calculateSimilarity(crop, inputs),
      icon: cropIcons[crop]
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">🌾 Crop Recommendation System</h1>
        <button 
          onClick={() => window.location.hash = '#home'}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors duration-300"
        >
          ← Home
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-8 sticky top-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">⚙️</span> Input Soil & Climate Conditions
          </h2>
          
          <div className="space-y-6">
            {[
              { key: 'N', label: 'Nitrogen (N) - mg/kg', min: 0, max: 200, step: 1, unit: '' },
              { key: 'P', label: 'Phosphorus (P) - mg/kg', min: 0, max: 200, step: 1, unit: '' },
              { key: 'K', label: 'Potassium (K) - mg/kg', min: 0, max: 200, step: 1, unit: '' },
              { key: 'temperature', label: 'Temperature (°C)', min: 5, max: 40, step: 0.1, unit: '°C' },
              { key: 'rainfall', label: 'Rainfall (mm)', min: 20, max: 300, step: 1, unit: 'mm' },
              { key: 'ph', label: 'Soil pH', min: 4.5, max: 8.5, step: 0.1, unit: '' }
            ].map(({ key, label, min, max, step, unit }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={inputs[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="w-16 text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {inputs[key]}{unit}
                  </span>
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soil Type
              </label>
              <select
                value={inputs.soil_type}
                onChange={(e) => handleInputChange('soil_type', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              >
                {soilCategories.map(soil => (
                  <option key={soil} value={soil}>{soil.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRecommend}
              disabled={isAnimating}
              className={`w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:from-green-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 ${
                isAnimating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isAnimating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                '✨ Generate Recommendations'
              )}
            </button>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-3 flex items-center">
              <span className="mr-2">💡</span> Pro Tip
            </h3>
            <p className="text-blue-700 text-sm">
              For best results, use soil test kits to measure N-P-K levels accurately. Rainfall data can be obtained from local weather stations.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top Recommendations */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">🎯</span> Top 3 Recommended Crops
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <CropCard 
                  key={rec.crop} 
                  crop={rec.crop} 
                  confidence={rec.confidence} 
                  suitability={rec.suitability} 
                  icon={rec.icon}
                  isTop3={true}
                  onClick={() => setSelectedCrop(rec)}
                />
              ))}
            </div>
          </div>

          {/* All Recommendations */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">📋</span> Full Recommendation List
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommendations.map((rec, idx) => (
                <CropCard 
                  key={rec.crop} 
                  crop={rec.crop} 
                  confidence={rec.confidence} 
                  suitability={rec.suitability} 
                  icon={rec.icon}
                  isTop3={false}
                  onClick={() => setSelectedCrop(rec)}
                />
              ))}
            </div>
          </div>

          {/* Confidence Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">📈</span> Confidence Distribution
              </h2>
              <button
                onClick={() => setShowChart(!showChart)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300"
              >
                {showChart ? 'Hide' : 'Show'} Chart
              </button>
            </div>
            
            {showChart && (
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-20 text-right pr-4">
                      <span className="font-medium text-gray-800 capitalize">{rec.crop}</span>
                    </div>
                    <div className="flex-1 mx-4 h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${parseFloat(rec.confidence)}%` }}
                      ></div>
                    </div>
                    <div className="w-20 text-right pl-4">
                      <span className="font-bold text-gray-800">{rec.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
