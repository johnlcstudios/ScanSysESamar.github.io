const video = document.getElementById('qr-video');
const canvas = document.getElementById('qr-canvas');
const context = canvas.getContext('2d');
const result = document.getElementById('outputData');

const qrCode = new QRCode(canvas);

function readQRCode() {
  qrCode.callback = (err, data) => {
    if (err) {
      console.error(err);
    } else {
      result.textContent = data;
    }
  };

  const stream = video.srcObject;
  const track = stream.getTracks()[0];
  const image = new Image();

  image.onload = () => {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    qrCode.decode();
  };

  image.src = video.srcObject;

  track.stop();
}

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then((stream) => {
      video.srcObject = stream;
      video.setAttribute('playsinline', true);
      video.play();

      readQRCode();

      video.onloadedmetadata = () => {
        video.width = video.videoWidth;
        video.height = video.videoHeight;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      };
    })
    .catch((error) => {
      console.error('Error accessing camera:', error);
    });
}

startCamera();