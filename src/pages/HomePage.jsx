import React from 'react';
import StatCard from '../components/StatCard';

const HomePage = () => (
  <div className="space-y-12">
    {/* Hero Section */}
    <div className="text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10"></div>
      <div className="relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
          🌾 AI Crop Advisor
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
          Harness the power of artificial intelligence to discover the perfect crops for your land with precision agriculture.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.hash = '#recommend'}
            className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:from-green-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300"
          >
            Get Started →
          </button>
          <button 
            onClick={() => window.location.hash = '#learn'}
            className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300"
          >
            Learn More
          </button>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-300 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-blue-300 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s'}}></div>
    </div>

    {/* Stats Section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <StatCard 
        icon="📊" 
        title="Accuracy" 
        value="94%" 
        subtitle="Based on real agricultural data"
        color="green"
      />
      <StatCard 
        icon="🌱" 
        title="Crops" 
        value="22+" 
        subtitle="Recommended varieties"
        color="blue"
      />
      <StatCard 
        icon="🌍" 
        title="Regions" 
        value="100+" 
        subtitle="Global climate adaptability"
        color="purple"
      />
    </div>

    {/* How It Works */}
    <div className="text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-12">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { step: "1", title: "Input Conditions", desc: "Enter your soil nutrients, pH, temperature and rainfall data" },
          { step: "2", title: "AI Analysis", desc: "Our machine learning model processes your data instantly" },
          { step: "3", title: "Get Recommendations", desc: "Receive personalized crop suggestions with confidence scores" }
        ].map((item, index) => (
          <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              {item.step}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HomePage;
