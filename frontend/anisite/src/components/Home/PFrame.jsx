import React from 'react';
import './extra.css';

function PFrame({source, content}) {
  return (
    <>
      <div className="mx-4 bg-gray-100 shadow-md w-[100%] h-[360px] flex justify-center relative border-b-gray-800 border-b-[1.5px]">
        <div 
          className="absolute inset-0 bg-center bg-fixed" 
          style={{ backgroundImage: `url(${source})` }}>
          <div className="image-gradient" />
        </div>
          <h1 className="absolute bottom-5 h1-text-styles text-5xl text-center uppercase">
              {content}
          </h1>
      </div> 
    </>
  )
}

export default PFrame