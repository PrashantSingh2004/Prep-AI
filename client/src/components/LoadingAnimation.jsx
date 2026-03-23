import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = () => {
  return (
    <div className="loading-container">
      <div className="loading">
        <div className="finger finger-1">
          <div className="finger-item">
            <span></span>
            <i></i>
          </div>
        </div>
        <div className="finger finger-2">
          <div className="finger-item">
            <span></span>
            <i></i>
          </div>
        </div>
        <div className="finger finger-3">
          <div className="finger-item">
            <span></span>
            <i></i>
          </div>
        </div>
        <div className="finger finger-4">
          <div className="finger-item">
            <span></span>
            <i></i>
          </div>
        </div>
        <div className="last-finger">
          <div className="last-finger-item">
            <i></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
