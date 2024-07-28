function controlVideoPlayback(event) {
  if (event.type === 'mouseover') {
    event.target.play();
  } else if (event.type === 'mouseout') {
    event.target.pause();
  }
}

function addHoverControl(video) {
  video.addEventListener('mouseover', controlVideoPlayback);
  video.addEventListener('mouseout', controlVideoPlayback);
}

function removeHoverControl(video) {
  video.removeEventListener('mouseover', controlVideoPlayback);
  video.removeEventListener('mouseout', controlVideoPlayback);
}

function toggleHoverControl(enable) {
  const videos = document.querySelectorAll('video, #movie_player video');
  videos.forEach(video => {
    if (enable) {
      addHoverControl(video);
    } else {
      removeHoverControl(video);
    }
  });
}

chrome.storage.sync.get('hoverControlEnabled', (data) => {
  const isEnabled = data.hoverControlEnabled ?? true; // Default to true if not set
  toggleHoverControl(isEnabled);

  // Listen for dynamically added videos
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeName === 'VIDEO' || node.matches && node.matches('#movie_player video')) {
          if (isEnabled) {
            addHoverControl(node);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
