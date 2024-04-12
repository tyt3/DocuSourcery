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