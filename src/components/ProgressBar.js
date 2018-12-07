import React from 'react';
import '../styles/ProgressBar.css';

const ProgressBar = ({ progress }) => (
  <div className="ProgressBar">
    <span>Staking round progress</span>
    <div className="ProgressBar-content">
      <span className="ProgressBar-number">{progress}%</span>
      <div className="ProgressBar-line" style={{ width: `${progress}%`}} />
    </div>
  </div>
);

export default ProgressBar;