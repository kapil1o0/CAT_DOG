from flask import Blueprint, request, jsonify
from app.utils import preprocess_image, load_models
import numpy as np
import logging

# Setup Logging
logging.basicConfig(level=logging.DEBUG)

# Define the Blueprint
main = Blueprint('main', __name__)

# Load multiple models
try:
    models = load_models('models')  # Load all models dynamically from the 'models' folder
    # Ensure all models are callable (i.e., they have a `predict` method)
    models = {k: v for k, v in models.items() if callable(getattr(v, "predict", None))}
    logging.info(f"Models loaded: {list(models.keys())}")
except Exception as e:
    models = {}
    logging.error(f"Error loading models: {e}")

# Define input sizes for each model
MODEL_INPUT_SIZES = {
    "cnn": (64, 64),
    "mobilenet": (224, 224),
    "resnet": (224, 224)
}

@main.route('/predict', methods=['POST'])
def predict():
    try:
        # Ensure model type is specified
        model_type = request.form.get('model', 'cnn')  # Default model: cnn
        if model_type not in models:
            logging.error(f"Model '{model_type}' not found in loaded models.")
            return jsonify({"error": f"Invalid model '{model_type}' specified"}), 400

        model = models[model_type]  # Select the model
        target_size = MODEL_INPUT_SIZES.get(model_type)

        if not target_size:
            logging.error(f"Input size not defined for model '{model_type}'")
            return jsonify({"error": f"Input size not defined for model '{model_type}'"}), 400

        logging.debug(f"Using model '{model_type}' with target size {target_size}")

        # Validate the file input
        if 'image' not in request.files:
            logging.error("No image file found in the request")
            return jsonify({"error": "No image provided"}), 400

        file = request.files['image']
        if file.filename == '':
            logging.error("No file selected in the form")
            return jsonify({"error": "No file selected"}), 400

        # Preprocess the image
        processed_image = preprocess_image(file, target_size=target_size)
        logging.debug(f"Image processed for {model_type}: {processed_image.shape}")

        # Perform prediction
        prediction = model.predict(processed_image)
        logging.debug(f"Raw Prediction for {model_type}: {prediction}")

        # Handle binary and multi-class outputs
        if prediction.shape[1] == 1:  # Binary classification
            labels = ["Cat", "Dog"]
            confidence = float(prediction[0][0])
            predicted_class = labels[1] if confidence > 0.5 else labels[0]
            confidence = confidence if confidence > 0.5 else 1 - confidence
        else:  # Multi-class classification
            labels = ["Cat", "Dog"]  # Update with actual labels if needed
            predicted_class = labels[np.argmax(prediction)]
            confidence = float(np.max(prediction))

        # Return results
        return jsonify({
            "success": True,
            "model": model_type,
            "predicted_class": predicted_class,
            "confidence": confidence
        }), 200

    except Exception as e:
        logging.error(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500
