const backgroundPort = chrome.runtime.connect({ name: 'popup' });

document.getElementById('startDeletion').addEventListener('click', () => {
  backgroundPort.postMessage({ action: 'startDeletion' });
});
