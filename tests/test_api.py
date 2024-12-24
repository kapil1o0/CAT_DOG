import unittest
from unittest.mock import patch, MagicMock
from io import BytesIO
from PIL import Image
from run import create_app

class TestAPI(unittest.TestCase):
    def setUp(self):
        self.app = create_app().test_client()
        self.test_image = BytesIO()
        img = Image.new('RGB', (64, 64), color='white')
        img.save(self.test_image, format='JPEG')
        self.test_image.seek(0)

    def tearDown(self):
        pass

    def test_no_image(self):
        response = self.app.post('/predict', data={})
        self.assertEqual(response.status_code, 400)
        self.assertIn("No image part in the request", response.get_data(as_text=True))

    @patch('app.utils.load_models')
    def test_valid_image(self, mock_model):
        mock_model_instance = MagicMock()
        mock_model_instance.predict.return_value = [[0.1, 0.9]]  # Dog with 90% confidence
        mock_model.return_value = mock_model_instance

        response = self.app.post(
            '/predict',
            data={'image': (self.test_image, 'test_image.jpg')}
        )

        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertEqual(json_data['predicted_class'], 'Dog')
        self.assertAlmostEqual(json_data['confidence'], 0.9, places=1)

    def test_invalid_file_type(self):
        invalid_file = BytesIO(b'This is not an image!')
        response = self.app.post(
            '/predict',
            data={'image': (invalid_file, 'test_file.txt')}
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid file type", response.get_data(as_text=True))

if __name__ == "__main__":
    unittest.main()
