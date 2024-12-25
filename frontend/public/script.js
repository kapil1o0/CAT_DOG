// Get the video and canvas elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture-button');
const imageDataInput = document.getElementById('image-data');

// Function to start the camera
function startCamera() {
  // Request access to the user's camera
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      // Assign the stream to the video element
      video.srcObject = stream;
    })
    .catch((err) => {
      console.error('Error accessing camera: ', err);
      alert('Could not access your camera.');
    });
}

// Function to capture a photo from the camera
function capturePhoto() {
  // Get the canvas context
  const context = canvas.getContext('2d');
  
  // Set the canvas size to match the video size
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // Draw the current video frame onto the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Convert the canvas to a base64 image string and store it in the input
  const imageData = canvas.toDataURL('image/png');
  imageDataInput.value = imageData;
  
  // Optionally, display the captured image in the UI
  const imgElement = document.createElement('img');
  imgElement.src = imageData;
  imgElement.alt = 'Captured Image';
  document.getElementById('prediction-result').appendChild(imgElement);
}

// Initialize the camera on page load
window.addEventListener('load', startCamera);

// Add event listener for the capture button
captureButton.addEventListener('click', capturePhoto);
