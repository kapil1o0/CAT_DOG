import requests

url = "http://127.0.0.1:5000/predict"
files = {"image": open("D:\Dog_Cat\Part 2 - Convolutional Neural Networks (CNN)\dataset\single_prediction\cat_or_dog_1.jpg", "rb")}
data = {"model": "resnet"}

response = requests.post(url, files=files, data=data)
print(response.json())
