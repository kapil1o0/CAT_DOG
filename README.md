Image Prediction App

Overview

The Image Prediction App is a web application that allows users to upload or capture images to predict whether the image is of a dog or a cat. It leverages multiple machine learning models like CNN, MobileNet, and ResNet for predictions, offering flexibility in model selection.

Features

Image Upload and Capture: Allows users to either upload an image file or capture one directly using their device camera.

Multiple Model Support: Users can choose between CNN, MobileNet, or ResNet for predictions.

Real-time Results: Displays predictions in a styled popup with confidence levels.

Dynamic Backend Integration: Supports multiple models dynamically loaded from the backend.

Error Handling: Provides clear error messages for invalid uploads, missing fields, or server issues.

Tech Stack

Frontend: React.js

Backend: Flask (Python)

Models: TensorFlow/Keras pre-trained models

Styling: CSS for UI enhancements

Installation

Prerequisites

Node.js (for React)

Python 3.x (for Flask backend)

Virtual environment (recommended for Python dependencies)

Steps

Clone the repository:

git clone <repository_url>
cd image-prediction-app

Backend Setup:

cd backend
python -m venv venv
source venv/bin/activate  # For Linux/MacOS
.\venv\Scripts\activate  # For Windows
pip install -r requirements.txt
python app.py

Frontend Setup:

cd frontend
npm install
npm start

Access the App: Open your browser and navigate to: http://localhost:3000

Usage

Open the application in your browser.

Click Get Started to upload or capture an image.

Select the desired model (CNN, MobileNet, ResNet).

Submit the image to view predictions and confidence levels in a styled popup.

API Endpoints

POST /predict

Description: Predict the class (dog/cat) of the uploaded image.

Request Body:

image: Image file (required)

model: Model type (cnn, mobilenet, resnet)

Response:

{
  "success": true,
  "data": {
    "predicted_class": "Dog",
    "confidence": 0.95,
    "all_predictions": [
      { "class": "Dog", "confidence": 0.95 },
      { "class": "Cat", "confidence": 0.05 }
    ]
  }
}

Folder Structure

flask_project/
│
├── app/
│   ├── routes.py
│   ├── utils.py
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.js
│   │   │   ├── index.js
│   │   │   ├── r.js
│   │   ├── styles.css
│   │   ├── package-lock.json
│   │   ├── package.json
│
├── models/
│   ├── cnn.h5
│   ├── mobilenet.h5
│   ├── resnet.h5
│
├── node_modules/
├── static/
├── templates/
├── tests/
├── uploads/
│
├── venv/
│
├── requirements.txt
├── .gitignore
│


Future Improvements

Add more pre-trained models for wider classification tasks.

Implement drag-and-drop functionality for easier uploads.

Include model performance metrics in the results.

Enhance mobile responsiveness.

License

This project is licensed under the MIT License. Feel free to use and modify it as per your requirements.

Contact

For any queries, reach out to:

Email: support@imagepredictor.com

GitHub: Repository Link

