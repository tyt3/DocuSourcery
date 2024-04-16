// //  Implement AJAX requests to server-side



// EDIT FORMS

// Make action-button div dynamically sticky 
const actionPanel = document.getElementById('action-panel');
const actionButtons = document.getElementById('action-buttons');

// Set the offset (15px below the top of the parent)
const offset = 15;

// Add a scroll event listener
window.addEventListener('scroll', () => {
  // Check if actionPanel and parentRect are not null
  if (actionPanel && actionButtons) {
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
  }
});


// VIEWPORT HEIGHT STYLING

// Calculate and set viewport height, minus top navbar

var topNavbar = document.getElementById('primaryNavbar');
var viewportHeight = window.innerHeight;

// Calculate the height of the top navbar
var topNavbarHeight = topNavbar.offsetHeight;

// Calculate the height of the target div
var vh_ds_100 = viewportHeight - topNavbarHeight;


// Jumbotron
var jumbotron = document.querySelector('.jumbotron');
if (jumbotron) {
  jumbotron.style.minHeight = vh_ds_100 + 'px'
};

// Project Side navbars

// Function to handle the resizing of vh-ds-100 divs
function handleResize() {
  // Get the viewport width
  const viewportWidth = window.innerWidth;

  // Select all elements with the vh-ds-100 class
  const projectNabars = document.querySelectorAll('.project-nav');

  // Loop through each div
  projectNabars.forEach(function(div) {
    // Check if viewport width is less than 1200px
    if (viewportWidth < 1200) {
      // Remove the height property
      div.style.removeProperty('height');
    } else {
      // Add the height property back
      div.style.height = vh_ds_100 + 'px';
      div.style.top = topNavbarHeight + 'px';
    }
  });
}

var projectNavbar = document.querySelector('.project-nav');
if (projectNavbar) {
  // Execute the function on page load
  window.addEventListener('load', handleResize);

  // Execute the function on window resize
  window.addEventListener('resize', handleResize);
};
