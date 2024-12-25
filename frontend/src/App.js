import React, { useState, useRef } from 'react';
import FileUpload from './components/FileUpload';
import CameraCapture from './components/CameraCapture';
import PredictionResult from './components/PredictionResult';
import ErrorMessage from './components/ErrorMessage';
import './styles.css';

const App = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleUpload = async (file) => {
    try {
      if (!file) {
        throw new Error('No file selected');
      }
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('image', file);

      const modelType = document.getElementById('model-select').value;
      if (!modelType) {
        throw new Error('No model selected');
      }
      formData.append('model', modelType);

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setResult(data.data);

      // Open prediction result in a new popup window with styles
      const popup = window.open('', 'Prediction Result', 'width=400,height=400');
      popup.document.write(`
        <html>
          <head>
            <title>Prediction Result</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                padding: 20px;
                text-align: center;
                background-color: #f4f4f9;
              }
              h1 {
                color: #333;
              }
              p {
                font-size: 16px;
                margin: 10px 0;
              }
              .result-container {
                padding: 20px;
                border-radius: 8px;
                background-color: #ffffff;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
            </style>
          </head>
          <body>
            <div class="result-container">
              <h1>Prediction Result</h1>
              <p>Predicted Class: ${data.data.predicted_class}</p>
              <p>Confidence: ${(data.data.confidence * 100).toFixed(2)}%</p>
            </div>
          </body>
        </html>
      `);
      popup.document.close();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64Image = canvas.toDataURL('image/png');
      const blob = base64ToBlob(base64Image);
      const file = new File([blob], 'captured_image.png', { type: 'image/png' });

      await handleUpload(file);
    } else {
      setError('Video or canvas not available');
    }
  };

  const base64ToBlob = (base64) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeType = base64.match(/data:([^;]+);/)[1];
    const arrayBuffer = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      arrayBuffer[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeType });
  };

  return (
    <div className="app-container">
      <header>
        <nav>
          <div className="logo">Image Predictor</div>
          
        </nav>
      </header>

      <main>
        <section className="welcome-section">
          <h1>Welcome to the Image Prediction App</h1>
          <p>Upload your images and let our model predict whether it’s a dog or a cat!</p>
          <button className="cta-button" onClick={() => setShowUploadSection(true)}>
            Get Started
          </button>
        </section>

        {showUploadSection && (
          <section id="upload-section">
            <h2>Upload or Capture an Image</h2>
            <FileUpload onUpload={handleUpload} />
            <CameraCapture videoRef={videoRef} canvasRef={canvasRef} handleUpload={handleUpload} />
            <label htmlFor="model-select">Choose a Model:</label>
            <select id="model-select" name="model">
              <option value="cnn">CNN</option>
              <option value="mobilenet">MobileNet</option>
              <option value="resnet">ResNet</option>
            </select>
            <br />
            <button onClick={() => handleCapture()}>Submit</button>
            {loading && <p>Loading... Please wait.</p>}
            {error && <ErrorMessage message={error} />}
          </section>
        )}
      </main>

      <footer>
        <p>&copy; 2024 Image Prediction App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
