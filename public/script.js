// //  Implement AJAX requests to server-side



// EDIT FORMS

// Make action-button div dynamically sticky 
const actionPanel = document.getElementById('action-panel');
const actionButtons = document.getElementById('action-buttons');

// Set the offset (15px below the top of the parent)
const offset = 15;

// Add a scroll event listener
window.addEventListener('scroll', () => {
  const parentRect = actionPanel.getBoundingClientRect();
  const parentTop = parentRect.top + window.scrollY;

  if (window.scrollY >= parentTop + offset) {
    // Make the action-buttons div sticky
    actionButtons.style.position = 'sticky';
    actionButtons.style.top = `${offset}px`;
  } else {
    // Remove sticky behavior
    actionButtons.style.position = 'static';
  }
});

