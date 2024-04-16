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

// Calculate and set viewport height, minus top navbar

// Get the viewport height
const viewportHeight = window.innerHeight;

// Get the top position of the div
const divTop = document.querySelector('.vh-ds-100').getBoundingClientRect().top;

// Calculate the height of the div
const divHeight = viewportHeight - divTop;

// Set the height of the div
document.querySelector('.vh-ds-100').style.height = divHeight + 'px';

// Add and Remove height for project navbar, depending on viewport
window.addEventListener('resize', function() {
  // Get the viewport width
  const viewportWidth = window.innerWidth;

  // Select the side-nav div
  const sideNav = document.querySelector('.project-nav');

  // Check if viewport width is less than 1200px
  if (viewportWidth < 1200) {
    // Remove the height property
    sideNav.style.removeProperty('height');
  } else {
    // Add the height property back
    sideNav.style.height = divHeight;
  }
});

// Trigger the resize event on page load to initially set the height
window.dispatchEvent(new Event('resize'));
