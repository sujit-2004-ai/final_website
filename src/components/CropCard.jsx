import React from 'react';

const CropCard = ({ crop, confidence, suitability, icon, isTop3, onClick }) => (
  <div 
    onClick={onClick}
    className={`relative cursor-pointer transition-all duration-500 transform hover:scale-105 hover:shadow-2xl rounded-xl p-6 text-center border-2 ${
      isTop3 
        ? suitability === 'Excellent' 
          ? 'border-green-200 bg-green-50 shadow-lg' 
          : suitability === 'Good' 
            ? 'border-blue-200 bg-blue-50' 
            : 'border-orange-200 bg-orange-50'
        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
    }`}
  >
    <div className="text-5xl mb-3">{icon}</div>
    <h3 className="text-xl font-bold text-gray-800 capitalize mb-2">{crop}</h3>
    <p className="text-lg font-semibold text-gray-700 mb-2">{confidence}</p>
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
      suitability === 'Excellent' ? 'bg-green-100 text-green-800' :
      suitability === 'Good' ? 'bg-blue-100 text-blue-800' :
      'bg-orange-100 text-orange-800'
    }`}>
      {suitability}
    </span>
    {isTop3 && (
      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
        Top {['🥇', '🥈', '🥉'][['rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate', 'banana', 'mango', 'grapes', 'watermelon', 'muskmelon', 'apple', 'orange', 'papaya', 'coconut', 'cotton', 'jute', 'coffee'].findIndex(r => r === crop) + 1]}
      </div>
    )}
  </div>
);

export default CropCard;
