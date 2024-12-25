import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CameraCapture = ({ videoRef, canvasRef, handleUpload }) => {
  const [error, setError] = useState(''); // State for error handling

  // Set up video stream
  useEffect(() => {
    const setupCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          throw new Error('Camera access is not supported by your browser.');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error accessing camera:', err);
      }
    };

    setupCamera();

    return () => {
      // Clean up the camera stream when the component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [videoRef]);

  // Capture image from video stream
  const handleCapture = async () => {
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (!canvas || !video) {
        throw new Error('Canvas or video element not found');
      }

      // Draw the current video frame onto the canvas
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas data to Base64
      const base64Image = canvas.toDataURL('image/png');

      // Convert Base64 to Blob
      const blob = base64ToBlob(base64Image);
      if (!blob) {
        throw new Error('Failed to convert Base64 to Blob');
      }

      // Convert Blob to a File object
      const file = new File([blob], 'captured_image.png', { type: 'image/png' });

      // Pass the File object to the upload function
      await handleUpload(file);
    } catch (err) {
      setError(err.message || 'An error occurred during capture');
      console.error(err);
    }
  };

  // Helper function: Convert Base64 string to Blob
  const base64ToBlob = (base64) => {
    try {
      const byteString = atob(base64.split(',')[1]); // Decode Base64
      const mimeType = base64.match(/data:([^;]+);/)[1]; // Extract MIME type
      const arrayBuffer = new Uint8Array(byteString.length);

      for (let i = 0; i < byteString.length; i++) {
        arrayBuffer[i] = byteString.charCodeAt(i);
      }

      return new Blob([arrayBuffer], { type: mimeType });
    } catch (err) {
      console.error('Error converting Base64 to Blob:', err);
      return null;
    }
  };

  return (
    <div className="camera-capture">
      {error && <p className="error-message">{error}</p>}

      {/* Video Stream */}
      <video ref={videoRef} autoPlay style={{ width: '50%', height: 'auto' }}></video>

      {/* Capture Button */}
      <button onClick={handleCapture}>Capture</button>

      {/* Canvas (Hidden, used for processing the image) */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

// PropTypes to enforce type checking
CameraCapture.propTypes = {
  videoRef: PropTypes.object.isRequired,
  canvasRef: PropTypes.object.isRequired,
  handleUpload: PropTypes.func.isRequired,
};

export default CameraCapture;
