


import tensorflow as tf

from PIL import Image
import numpy as np
import io
import os

import logging

def preprocess_image(file):
    try:
        image = Image.open(io.BytesIO(file.read()))
        image = image.convert("RGB")  # Ensure RGB format
        image = image.resize((64, 64))  # Resize to match model input
        image = np.array(image) / 255.0  # Normalize pixel values
        return np.expand_dims(image, axis=0)  # Add batch dimension
    except Exception as e:
        raise ValueError(f"Error in preprocessing image: {str(e)}")


def load_models():
    try:
        # Retrieve model path from environment variable or use default path
        model_path = os.getenv('MODEL_PATH', os.path.join(os.getcwd(), 'models', 'cnn.h5'))

        # Check if the model file exists
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at path: {model_path}")

        # Log the model path being used
        logging.info(f"Loading model from: {model_path}")

        # Load the model
        model = tf.keras.models.load_model(model_path)
        logging.info("Model loaded successfully.")
        
        # Log model summary (optional, for debugging large models)
        logging.info(f"Model Summary: {model.summary()}")
        
        return model

    except FileNotFoundError as fnf_error:
        logging.error(f"File not found: {fnf_error}")
        raise
    except Exception as e:
        logging.error(f"Failed to load model: {e}")
        raise IOError(f"Failed to load model: {str(e)}")


