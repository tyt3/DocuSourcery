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

// implement  drop 
function allowDrop(ev) {
    ev.preventDefault(); // Prevent default behavior (prevent it from being dropped in some other element)
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id); // Get the id of the draggable item
  }
  
  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    updateBackend(data); // Call the function to update the backend after dropping
  }

//   drag
function allowDrop(ev) {
    ev.preventDefault(); // Prevent default behavior (prevent it from being dropped in some other element)
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id); // Get the id of the draggable item
  }
  
  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    updateBackend(data); // Call the function to update the backend after dropping
  }
  
//   update backend
function updateBackend(itemId) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "your-backend-url", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log('Response from server: ', this.responseText); // Handle the response from the server
      }
    };
    var data = JSON.stringify({ item_id: itemId });
    xhr.send(data);
  }
  