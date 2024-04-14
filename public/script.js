//  Implement AJAX requests to server-side

// Create an XMLHttpRequest Object
var xhr = new XMLHttpRequest();

// Configure the Request
xhr.open("GET", "The URL comes here", true);

//Send the Request
xhr.send();

// Handle the Response
xhr.onload = function() {
    if (xhr.status === 200) {
        console.log(xhr.responseText);
    }
};

// Displaying Data
xhr.onload = function() {
    if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        document.getElementById("result").innerHTML = data.message;
    }
};

// Creating a POST request with AJAX

// Create XMLHttpRequest
var xhr = new XMLHttpRequest();

//  Configure Request
xhr.open("POST", "https://api.example.com/endpoint", true);

// Send Data
var data = {
    key1: 'value1',
    key2: 'value2'
};
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify(data));

// Handle Response

xhr.onload = function() {
    if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        // Handle the response data
    }
};

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
