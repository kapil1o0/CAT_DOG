import tensorflow as tf
from PIL import Image
import numpy as np
import io
import os
import logging

# Initialize logging
logging.basicConfig(level=logging.DEBUG)


def preprocess_image(file, target_size=(64, 64)):
    """
    Preprocesses an image file to be model-ready.

    Args:
        file: A file-like object containing the image.
        target_size: Tuple specifying the target size (width, height) for the image.

    Returns:
        A NumPy array ready to be fed into the model.

    Raises:
        ValueError: If there's an issue with processing the image.
    """
    try:
        # Open the image
        image = Image.open(io.BytesIO(file.read()))
        logging.debug(f"Original image size: {image.size}, mode: {image.mode}")
        
        # Ensure the image is in RGB format
        image = image.convert("RGB")
        logging.debug("Image converted to RGB.")
        
        # Resize the image to the target size
        image = image.resize(target_size)
        logging.debug(f"Image resized to: {target_size}.")
        
        # Normalize pixel values and add batch dimension
        image = np.array(image) / 255.0
        logging.debug(f"Image normalized. Shape after normalization: {image.shape}.")
        
        return np.expand_dims(image, axis=0)  # Add batch dimension
    except Exception as e:
        logging.error(f"Error in preprocessing image: {e}")
        raise ValueError(f"Error in preprocessing image: {str(e)}")


def load_models(model_dir='models'):
    """
    Dynamically loads all models from the specified directory.

    Args:
        model_dir: Path to the directory containing the model files.

    Returns:
        A dictionary mapping model names to loaded model instances.

    Raises:
        IOError: If the models cannot be loaded due to an issue.
    """
    try:
        models = {}

        # Check if the directory exists
        if not os.path.exists(model_dir):
            raise FileNotFoundError(f"Model directory not found: {model_dir}")
        logging.debug(f"Model directory exists: {model_dir}")

        # Iterate through all files in the directory
        for filename in os.listdir(model_dir):
            if filename.endswith('.h5'):
                model_name = filename.split('.')[0]  # Extract the model name
                model_path = os.path.join(model_dir, filename)

                logging.info(f"Attempting to load model: {model_name} from {model_path}")

                # Load the model and store it in the dictionary
                models[model_name] = tf.keras.models.load_model(model_path)
                logging.info(f"Model {model_name} loaded successfully.")

        if not models:
            raise ValueError("No models found in the specified directory.")

        logging.debug(f"Models loaded: {list(models.keys())}")
        return models
    except Exception as e:
        logging.error(f"Failed to load models: {e}")
        raise IOError(f"Failed to load models: {str(e)}")
