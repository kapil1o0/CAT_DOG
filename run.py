from flask import Flask, request, jsonify
from flask_cors import CORS
from app.utils import preprocess_image, load_models
import numpy as np
import logging

# Initialize logging
logging.basicConfig(level=logging.DEBUG)

# Load models dynamically
try:
    models = load_models('models')  # Ensure the 'models' folder has the appropriate `.h5` files
    logging.info(f"Available models: {list(models.keys())}")
except Exception as e:
    logging.critical(f"Failed to load models: {e}")
    raise

# Define class labels
CLASS_LABELS = ['Cat', 'Dog']  # Update as per your actual class labels

# Define input sizes for each model
MODEL_INPUT_SIZES = {
    "cnn": (64, 64),
    "mobilenet": (224, 224),
    "resnet": (224, 224)
}


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Prediction route
    @app.route('/predict', methods=['POST'])
    def predict():
        # Validate the model parameter
        model_type = request.form.get('model', 'cnn')  # Default to 'cnn'
        if model_type not in models:
            logging.warning(f"Invalid model specified: {model_type}")
            return jsonify({"success": False, "error": f"Invalid model specified: {model_type}"}), 400

        # Select the model
        model = models[model_type]

        # Validate the image file
        if 'image' not in request.files:
            logging.warning("No image provided in request")
            return jsonify({"success": False, "error": "No image provided"}), 400

        file = request.files['image']
        if file.filename == '':
            logging.warning("No file selected in request")
            return jsonify({"success": False, "error": "No file selected"}), 400

        try:
            # Preprocess the uploaded image with the correct target size
            target_size = MODEL_INPUT_SIZES[model_type]
            img_array = preprocess_image(file, target_size=target_size)
            logging.debug(f"Image preprocessed successfully for model {model_type}, shape: {img_array.shape}")

            # Perform prediction
            predictions = model.predict(img_array)
            logging.debug(f"Model prediction output: {predictions}, shape: {predictions.shape}")

            if len(predictions[0]) == 1:
                # Binary classification: single probability output
                confidence = float(predictions[0][0])
                predicted_class = CLASS_LABELS[1] if confidence > 0.5 else CLASS_LABELS[0]
                confidence = confidence if confidence > 0.5 else 1 - confidence
            else:
                # Multi-class classification
                predicted_index = int(np.argmax(predictions))  # Index of highest probability
                predicted_class = CLASS_LABELS[predicted_index]  # Class label
                confidence = float(predictions[0][predicted_index])  # Confidence of the predicted class

            # Get all predictions sorted by confidence (for multi-class models)
            all_predictions = [
                {"class": CLASS_LABELS[i], "confidence": float(predictions[0][i])}
                for i in range(len(CLASS_LABELS))
            ] if len(predictions[0]) > 1 else [{"class": predicted_class, "confidence": confidence}]

            all_predictions_sorted = sorted(all_predictions, key=lambda x: x["confidence"], reverse=True)

            return jsonify({
                "success": True,
                "data": {
                    "predicted_class": predicted_class,
                    "confidence": confidence,
                    "all_predictions": all_predictions_sorted
                }
            }), 200

        except Exception as e:
            logging.error(f"Error during prediction: {str(e)}")
            return jsonify({"success": False, "error": str(e)}), 500

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
