from flask import Blueprint, request, jsonify
from app.utils import preprocess_image, load_models
import numpy as np

# Define the Blueprint
main = Blueprint('main', __name__)

# Load the model at the module level for efficiency
try:
    model = load_models()  # Ensure load_model is implemented correctly in utils.py
except Exception as e:
    model = None
    print(f"Error loading model: {e}")

# Define the prediction route
@main.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Preprocess the image
        processed_image = preprocess_image(file)  # Ensure this function handles file streams correctly
        prediction = model.predict(processed_image)

        # Convert prediction to class label
        labels = ["Cat", "Dog"]
        predicted_class = labels[np.argmax(prediction)]
        confidence = float(np.max(prediction))

        return jsonify({
            "message": "Prediction successful",
            "predicted_class": predicted_class,
            "confidence": confidence
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
