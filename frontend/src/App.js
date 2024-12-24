import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import PredictionResult from './components/PredictionResult';
import ErrorMessage from './components/ErrorMessage';

const App = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async (file) => {
    setError('');
    setResult('');

    try {
      const formData = new FormData();
      formData.append('image', file); // Ensure 'image' matches your backend's key

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.data); // Backend returns `data` object with predictions
      } else {
        setError(data.error || 'Failed to get prediction');
      }
    } catch (err) {
      setError('Error uploading file');
    }
  };

  return (
    <div>
      <h1>Image Prediction App</h1>
      <FileUpload onUpload={handleUpload} />
      {error && <ErrorMessage message={error} />}
      {result && <PredictionResult result={result} />}
    </div>
  );
};

export default App;
