import React from 'react';
import '../../css/SpinnerOverlay.css'; // styling below

const SpinnerOverlay = ({text}) => {
  text = text || "Loading";
  return (
    <div className="spinner-overlay">
      <div className="loader">
        <p className="loader-text">{text}</p>
        <span className="load"></span>
      </div>
    </div>
  );
};

export default SpinnerOverlay;
