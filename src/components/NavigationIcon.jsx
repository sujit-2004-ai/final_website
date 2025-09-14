import React from 'react';

const NavigationIcon = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
      isActive 
        ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg' 
        : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
    }`}
  >
    <span className="text-2xl mb-1">{icon}</span>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export default NavigationIcon;
