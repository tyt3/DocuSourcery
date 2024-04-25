 ////////////////////
//  AJAX requests //
///////////////////

async function fetchUsers() {
  try {
      // Check if the current URL contains "project" and "edit"
      if (window.location.pathname.includes('project') && window.location.pathname.includes('edit')) {
          // Fetch users only if the URL matches the condition
          const response = await fetch('/users');
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const users = await response.json();
          return users;
      } else {
          // If the URL doesn't match the condition, return an empty array
          return [];
      }
  } catch (error) {
      // Handle errors
      console.error('There was a problem with the fetch operation:', error.message);
      throw error; // Re-throw the error to propagate it to the caller
  }
}


// Example usage:
fetchUsers()
  .then(users => {
    // Use the list of users in other functions or logic
    console.log(users); // Log the list of users
    // Perform further operations with the users data
  })
  .catch(error => {
    // Handle errors
    console.error('Error fetching users:', error.message);
  });


// Function to populate user input field with users as someone types
const userField = document.getElementById('username');
const dropdown = document.createElement('select');

if (userField) {
  

  dropdown.id = 'userList';
  dropdown.style.display = 'none'; // Hide the dropdown initially
  userField.parentNode.insertBefore(dropdown, userField.nextSibling);

  // Add event listener to select element
  dropdown.addEventListener('mousedown', function(event) {
    event.preventDefault(); // Prevent the default behavior (selecting the option)
    // Get the selected option
    const selectedOption = event.target;
    // Set the value of the input field to the selected option's value
    userField.value = selectedOption.value;
    // Hide the dropdown after selecting an option
    dropdown.style.display = 'none';
  });

  userField.addEventListener('input', async function() {
    const inputValue = userField.value.trim();
    if (inputValue.length > 1) {
      const users = await fetchUsers();

      const filteredUsers = users.filter(user => {
        // Filter users based on username, full name, or email address
        return (
          user.username.toLowerCase().includes(inputValue.toLowerCase()) ||
          (user.firstName + ' ' + user.lastName).toLowerCase().includes(inputValue.toLowerCase()) ||
          user.email.toLowerCase().includes(inputValue.toLowerCase())
        );
      });

      // Clear previous options
      dropdown.innerHTML = '';

      // Create and append new options
      filteredUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.username; 
        option.textContent = `${user.firstName} ${user.lastName} (${user.username})`;
        dropdown.appendChild(option);
      });

      // Show the dropdown if options are available
      if (filteredUsers.length > 0) {
        dropdown.style.display = 'block';
      } else {
        dropdown.style.display = 'none'; // Hide the dropdown if no options are available
      }
    } else {
      dropdown.style.display = 'none'; // Hide the dropdown if input is empty
    }
  });
};



//Add a JavaScript event listener to detect when the user types in the text field
// const userSearchField = document.getElementById("search-field")

// if (userSearchField) {
//   userSearchField.addEventListener("input", function () {
//   const query = this.value;
//     if (query.length > 2) { // Trigger when the user types at least 3 characters
//         fetchSuggestions(query);
//     }
//   });
// }

// // fetchSuggestions function
// function fetchSuggestions(query) {
//   // This is a simulated list of suggestions. In practice, you would get this from a backend service.
//   const allUsers = ["alice@example.com", "bob@example.com", "charlie@example.com", "david@example.com"];
  
//   const filteredSuggestions = allUsers.filter(user => user.includes(query));

//   const dropdown = document.getElementById("suggestions");
//   dropdown.innerHTML = ""; // Clear existing suggestions
  
//   filteredSuggestions.forEach(suggestion => {
//       const option = document.createElement("option");
//       option.value = suggestion;
//       option.textContent = suggestion;
//       dropdown.appendChild(option);
//   });
// }

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
var dropdowns = document.getElementsByClassName("dropdown-btn");

if (dropdowns) {
  Array.from(dropdowns).forEach(function(dropdown) {
    var dropdownContent = dropdown.nextElementSibling;   
    var isActivePage = dropdown.querySelector('a').classList.contains('active-page');
    var isActiveDoc = dropdown.querySelector('a').classList.contains('active-doc');
      
    if (isActivePage || isActiveDoc) {
      dropdownContent.style.display = "block";
    }
    
    dropdown.addEventListener("click", function() {
      var dropdownContent = this.nextElementSibling;
      if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
      } else {
        dropdownContent.style.display = "block";
      }
    });
  });
}


///////////////////////
// drag and drop   //
/////////////////////


// implement  drop 
// function allowDrop(ev) {
//   ev.preventDefault(); // Prevent default behavior (prevent it from being dropped in some other element)
// }

// function drag(ev) {
//   ev.dataTransfer.setData("text", ev.target.id); // Get the id of the draggable item
// }

// function drop(ev) {
//   ev.preventDefault();
//   var data = ev.dataTransfer.getData("text");
//   ev.target.appendChild(document.getElementById(data));
//   updateBackend(data); // Call the function to update the backend after dropping
// }

// //   drag
// function allowDrop(ev) {
//   ev.preventDefault(); // Prevent default behavior (prevent it from being dropped in some other element)
// }

// function drag(ev) {
//   ev.dataTransfer.setData("text", ev.target.id); // Get the id of the draggable item
// }

// function drop(ev) {
//   ev.preventDefault();
//   var data = ev.dataTransfer.getData("text");
//   ev.target.appendChild(document.getElementById(data));
//   updateBackend(data); // Call the function to update the backend after dropping
// }

// //   update backend
// function updateBackend(itemId) {
//   var xhr = new XMLHttpRequest();
//   xhr.open("POST", "your-backend-url", true);
//   xhr.setRequestHeader("Content-Type", "application/json");
//   xhr.onreadystatechange = function () {
//     if (xhr.readyState === 4 && xhr.status === 200) {
//       console.log('Response from server: ', this.responseText); // Handle the response from the server
//     }
//   };
//   var data = JSON.stringify({ item_id: itemId });
//   xhr.send(data);
// }


// ///////////////////////
// // form submission  //
// /////////////////////
// document.getElementById("updateProjectForm").addEventListener("submit", function (event) {
//   event.preventDefault(); // Prevent the default form submission behavior

//   const projectId = document.getElementById("projectId").value;
//   const projectName = document.getElementById("projectName").value;
//   const projectDescription = document.getElementById("projectDescription").value;

//   const updateData = {
//     name: projectName,
//     description: projectDescription,
//   };

//   // Using AJAX request using Fetch API to update project
//   fetch(`/api/projects/${projectId}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(updateData), // Convert data to JSON string
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.success) {
//         console.log("Project updated successfully");
//       } else {
//         console.error("Failed to update project", data.error);
//       }
//     })
//     .catch((error) => {
//       console.error("Error updating project:", error);
//     });
// });


// //backend handling
// app.put("/api/projects/:id", (req, res) => {
//   const projectId = req.params.id;
//   const updatedData = req.body;


// Project.update(projectId, updatedData)
//     .then(() => {
//       res.json({ success: true });
//     })
//     .catch((error) => {
//       res.status(500).json({ success: false, error });
//     });
// });

