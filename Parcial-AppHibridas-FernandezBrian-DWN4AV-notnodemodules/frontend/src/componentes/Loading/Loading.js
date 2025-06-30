import React from 'react';
import './Loading.scss';

const Loading = ({ mensaje = 'Cargando...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <p className="loading-text">{mensaje}</p>
    </div>
  );
};

export default Loading; 