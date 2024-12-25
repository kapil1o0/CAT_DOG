import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      setError('No file selected. Please choose an image.');
      setFile(null);
      setPreview(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size exceeds the allowed 5MB limit!');
      setFile(null);
      setPreview(null);
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(selectedFile.type)) {
      setError('Invalid file type! Please upload an image (JPEG, PNG, or GIF).');
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setError('');
    setPreview(URL.createObjectURL(selectedFile)); // Create a preview URL for the image
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
      // Reset after upload
      setFile(null);
      setPreview(null);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <label htmlFor="file-upload" style={{ fontWeight: 'bold' }}>Choose an image to upload:</label>
      <br />
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ margin: '10px 0' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {preview && (
        <div>
          <p>Image Preview:</p>
          <img
            src={preview}
            alt="Preview"
            style={{ width: '200px', height: 'auto', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!file}
        style={{
          padding: '10px 20px',
          backgroundColor: file ? '#4CAF50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: file ? 'pointer' : 'not-allowed',
        }}
      >
        Upload and Predict
      </button>
    </div>
  );
};

FileUpload.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default FileUpload;
