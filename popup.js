document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');

  // Load the current state
  chrome.storage.sync.get('hoverControlEnabled', (data) => {
    const isEnabled = data.hoverControlEnabled ?? true; // Default to true if not set
    updateButtonState(isEnabled);
  });

  // Update the state when the button is clicked
  toggleButton.addEventListener('click', () => {
    chrome.storage.sync.get('hoverControlEnabled', (data) => {
      const isEnabled = data.hoverControlEnabled ?? true;
      const newState = !isEnabled;
      chrome.storage.sync.set({ hoverControlEnabled: newState }, () => {
        updateButtonState(newState);

        // Reload the current tab to apply changes
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: (enable) => {
              const controlVideoPlayback = (event) => {
                if (event.type === 'mouseover') {
                  event.target.play();
                } else if (event.type === 'mouseout') {
                  event.target.pause();
                }
              };

              const addHoverControl = (video) => {
                video.addEventListener('mouseover', controlVideoPlayback);
                video.addEventListener('mouseout', controlVideoPlayback);
              };

              const removeHoverControl = (video) => {
                video.removeEventListener('mouseover', controlVideoPlayback);
                video.removeEventListener('mouseout', controlVideoPlayback);
              };

              const videos = document.querySelectorAll('video, #movie_player video, .html5-main-video');
              videos.forEach(video => {
                if (enable) {
                  addHoverControl(video);
                } else {
                  removeHoverControl(video);
                }
              });
            },
            args: [newState]
          });
        });
      });
    });
  });

  function updateButtonState(isEnabled) {
    toggleButton.textContent = isEnabled ? 'Disable Hover Control' : 'Enable Hover Control';
    toggleButton.className = isEnabled ? 'enabled' : 'disabled';
  }
});
