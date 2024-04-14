// //  Implement AJAX requests to server-side


// Make action-button div dynamically sticky 
const actionButtons = document.getElementById('action-buttons');
const actionPanel = document.getElementById('action-panel');

// Calculate the offset (15px below the top of the parent)
const offset = 15;

// Add a scroll event listener
window.addEventListener('scroll', () => {
  const parentRect = actionPanel.getBoundingClientRect();
  const parentTop = parentRect.top + window.scrollY;

  if (window.scrollY >= parentTop + offset) {
    // Make the action-buttons sticky
    actionButtons.style.position = 'sticky';
    actionButtons.style.top = `${offset}px`;
  } else {
    // Remove sticky behavior
    actionButtons.style.position = 'static';
  }
});

