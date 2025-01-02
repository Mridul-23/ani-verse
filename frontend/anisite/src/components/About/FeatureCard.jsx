import React from 'react'

const FeatureCard = ({ title, description, icon }) => (
  <div className="flex flex-col items-center cursor-default glass p-6 rounded-lg shadow-md">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold text-highlight mb-2">{title}</h3>
    <p className="text-center text-gray-400">{description}</p>
  </div>
);


export default FeatureCard