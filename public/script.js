 ////////////////////
//  AJAX requests //
///////////////////
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
// xhr.open("POST", "https://api.example.com/endpoint", true);

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
        console.log("Response data:", response);

        // Example: Display a success message
        document.getElementById("result").innerText = "Data submitted successfully!";

        // Additional logic based on response
        if (response.success) {
            console.log("Operation was successful.");
        } else {
            console.error("Operation failed:", response.error);
        }
        } else {
        // The request failed, handle the error
        console.error("Request failed with status:", xhr.status);
        }
        };

        // Handle network errors
        xhr.onerror = function() {
        console.error("Network error occurred during the request.");
        };

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
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}

//Add a JavaScript event listener to detect when the user types in the text field. 
document.getElementById("search-field").addEventListener("input", function () {
  const query = this.value;
  if (query.length > 2) { // Trigger when the user types at least 3 characters
      fetchSuggestions(query);
  }
});

// fetchSuggestions function
function fetchSuggestions(query) {
  // This is a simulated list of suggestions. In practice, you would get this from a backend service.
  const allUsers = ["alice@example.com", "bob@example.com", "charlie@example.com", "david@example.com"];
  
  const filteredSuggestions = allUsers.filter(user => user.includes(query));

  const dropdown = document.getElementById("suggestions");
  dropdown.innerHTML = ""; // Clear existing suggestions
  
  filteredSuggestions.forEach(suggestion => {
      const option = document.createElement("option");
      option.value = suggestion;
      option.textContent = suggestion;
      dropdown.appendChild(option);
  });
}

// set API endpoint that returns matching users based on the query string.
app.get('/users', (req, res) => {
  const query = req.query.q || '';
  const filteredUsers = userList.filter(user =>
    user.name.toLowerCase().includes(query.toLowerCase()) ||
    user.email.toLowerCase().includes(query.toLowerCase())
  );
  res.json(filteredUsers);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


///////////////////////
// drag and drop   //
/////////////////////


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