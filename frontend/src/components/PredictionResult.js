import React from 'react';

const PredictionResult = ({ result }) => {
  if (!result) return null;

  return (
    <div>
      <h3>Prediction Results</h3>
      <p>Class: {result.predicted_class}</p>
      <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
      <h4>All Predictions:</h4>
      <ul>
        {result.all_predictions.map((item, index) => (
          <li key={index}>
            {item.class}: {(item.confidence * 100).toFixed(2)}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PredictionResult;
