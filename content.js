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
  
  // Select all video elements on the page and add hover control
  const videos = document.querySelectorAll('video');
  videos.forEach(video => addHoverControl(video));
  
  // Listen for dynamically added videos
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeName === 'VIDEO') {
          addHoverControl(node);
        }
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  