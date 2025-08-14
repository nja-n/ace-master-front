import React from 'react';
import '../../css/SpinnerOverlay.css'; // styling below

const SpinnerOverlay = () => {
  return (
    <div className="spinner-overlay">
      <div className="loader">
        <p className="loader-text">Loading</p>
        <span className="load"></span>
      </div>
    </div>
  );
};

export default SpinnerOverlay;
