import React from 'react';

const PredictionResult = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div className="prediction-tab">
      <div className="prediction-header">
        <h4>Prediction Results</h4>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="prediction-body">
        <p><strong>Class:</strong> {result.predicted_class}</p>
        <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
        <h5>All Predictions:</h5>
        <ul>
          {result.all_predictions.map((item, index) => (
            <li key={index}>
              {item.class}: {(item.confidence * 100).toFixed(2)}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default PredictionResult;
