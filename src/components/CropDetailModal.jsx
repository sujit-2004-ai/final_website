import React from 'react';

const CropDetailModal = ({ selectedCrop, setSelectedCrop, idealConditions, cropIcons, crops }) => {
  if (!selectedCrop) return null;

  const ideal = idealConditions[selectedCrop.crop];
  const suitableCrops = crops.filter(c => c !== selectedCrop.crop && 
    idealConditions[c].soil === ideal.soil &&
    Math.abs(idealConditions[c].temp - ideal.temp) <= 5 &&
    Math.abs(idealConditions[c].rain - ideal.rain) <= 50
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <span className="text-6xl mr-4">{selectedCrop.icon}</span>
              <div>
                <h2 className="text-4xl font-bold text-gray-800 capitalize">{selectedCrop.crop}</h2>
                <p className="text-gray-600">Confidence: {selectedCrop.confidence}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedCrop(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ideal Growing Conditions</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nitrogen (N):</span>
                  <span className="font-bold">{ideal.N} mg/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phosphorus (P):</span>
                  <span className="font-bold">{ideal.P} mg/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Potassium (K):</span>
                  <span className="font-bold">{ideal.K} mg/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-bold">{ideal.temp}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rainfall:</span>
                  <span className="font-bold">{ideal.rain} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">pH Level:</span>
                  <span className="font-bold">{ideal.ph}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Soil Type:</span>
                  <span className="font-bold">{ideal.soil.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Why This Crop?</h3>
              <p className="text-gray-700 mb-4">
                Based on your input conditions, this crop has an excellent match with your soil and climate profile. 
                {selectedCrop.suitability === 'Excellent' && ' Your conditions align perfectly with its ideal growing requirements.'}
                {selectedCrop.suitability === 'Good' && ' Your conditions are very favorable for this crop.'}
                {selectedCrop.suitability === 'Moderate' && ' This crop can grow under your conditions but may require additional care.'}
              </p>
              
              <h4 className="font-bold text-gray-800 mb-2">Suggested Management Practices:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Optimize irrigation based on rainfall patterns</li>
                <li>Maintain proper nutrient balance with fertilizers</li>
                <li>Monitor pH levels regularly</li>
                <li>Consider companion planting for pest control</li>
              </ul>
            </div>
          </div>

          {suitableCrops.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Alternative Crops With Similar Requirements</h3>
              <div className="flex flex-wrap gap-3">
                {suitableCrops.map(crop => (
                  <div key={crop} className="bg-gray-100 px-4 py-2 rounded-full text-gray-800 font-medium flex items-center">
                    <span className="mr-2">{cropIcons[crop]}</span>
                    {crop}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-8">
            <button 
              onClick={() => setSelectedCrop(null)}
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetailModal;
