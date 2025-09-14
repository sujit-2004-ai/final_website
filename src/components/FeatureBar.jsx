import React from 'react';

const FeatureBar = ({ feature, importance, icon }) => (
  <div className="flex items-center mb-4">
    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-lg">
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex justify-between mb-1">
        <span className="font-medium text-gray-800 capitalize">{feature.replace('_', ' ')}</span>
        <span className="text-sm text-gray-600">{(importance * 100).toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-indigo-400 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${importance * 100}%` }}
        ></div>
      </div>
    </div>
  </div>
);

export default FeatureBar;
