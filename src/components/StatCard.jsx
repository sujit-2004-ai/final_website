import React from 'react';

const StatCard = ({ icon, title, value, subtitle, color = "green" }) => (
  <div className={`bg-white rounded-xl p-6 shadow-lg border-l-4 border-${color}-500`}>
    <div className="flex items-center">
      <span className="text-3xl mr-4">{icon}</span>
      <div>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export default StatCard;
