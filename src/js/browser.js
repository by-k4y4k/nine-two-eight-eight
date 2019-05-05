// ES6 imports because... apparently... it's an ES6 module
import QrScanner from '../../src/js/qr-scanner.min.js';

// set the path for the ServiceWorker
QrScanner.WORKER_PATH = '../../js/qr-scanner-worker.min.js';

// Set up elements
const video = document.getElementById('qr-video');
const camHasCamera = document.getElementById('cam-has-camera');
const camQrResult = document.getElementById('cam-qr-result');

/**
 * Changes elements on the page to show the data from the QR code
 * @param {*} label
 * @param {*} result
 */
function setResult(label, result) {
  // Show the result on the page
  label.textContent = result;

  clearTimeout(label.highlightTimeout);
  label.highlightTimeout = setTimeout(
      () => (label.style.color = 'inherit'),
      100
  );

  redirectPage(`https://nine-two-eight-eight.herokuapp.com/${result}`);
}

QrScanner.hasCamera().then(
    (hasCamera) => (camHasCamera.textContent = hasCamera)
);

const scanner = new QrScanner(video, function(result) {
  return setResult(camQrResult, result);
});

scanner.start();
console.log('new scanner');

/**
 * Redirects to other page.
 * @param {string} location Accepts "/:destination"
 */
const redirectPage = (location) => {
  // the redirect should not go offsite!

  const regex = /https?/gi;

  if (regex.test(location) !== true) {
    alert('Redir failed');
    return;
  }

  window.location.href = location;
};
