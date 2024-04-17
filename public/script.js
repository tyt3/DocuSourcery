 ////////////////////
//  AJAX requests //
///////////////////



// ///////////////////////////
// VIEWPORT HEIGHT STYLING //
////////////////////////////

// Function to calculate and set viewport height, minus top navbar
function calculateViewportHeight() {
  // Get the top navbar element
  var topNavbar = document.getElementById('primaryNavbar');

  // Calculate the viewport height
  var viewportHeight = window.innerHeight;

  // Calculate the height of the top navbar
  var topNavbarHeight = topNavbar.offsetHeight;

  // Calculate the height of the target div
  var vh_ds_100 = viewportHeight - topNavbarHeight;

  // Set the height of the jumbotron
  var jumbotron = document.querySelector('.jumbotron');
  if (jumbotron) {
    jumbotron.style.minHeight = vh_ds_100 + 'px';
  }

  // Set the height of project side navbars
  var projectNavbars = document.querySelectorAll('.project-nav');
  projectNavbars.forEach(function(navbar) {
    if (window.innerWidth < 1200) {
      // Remove the height property if viewport width is less than 1200px
      navbar.style.removeProperty('height');
    } else {
      // Set the height and top position properties
      navbar.style.height = vh_ds_100 + 'px';
      navbar.style.top = topNavbarHeight + 'px';
    }
  });

  // Update offset for action buttons
  var offset = topNavbarHeight + 15;

  // Make action buttons sticky
  const actionPanel = document.getElementById('action-panel');
  const actionButtons = document.getElementById('action-buttons');
  if (actionPanel && actionButtons) {
    const parentRect = actionPanel.getBoundingClientRect();
    const parentTop = parentRect.top + window.scrollY;
    if (window.scrollY >= parentTop + offset) {
      actionButtons.style.position = 'sticky';
      actionButtons.style.top = `${offset}px`;
    } else {
      actionButtons.style.position = 'static';
    }
  }
}

// Call the calculateViewportHeight function on page load
window.addEventListener('load', calculateViewportHeight);

// Call the calculateViewportHeight function on window resize
window.addEventListener('resize', calculateViewportHeight);

///////////////////////
// Sidenav Dropdown //
/////////////////////

/* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content - This allows the user to have multiple dropdowns without any conflict */
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}
