# Introduction

Our project, **DocuSourcery**, is a lightweight web app for creating, organizing, and publishing project documentation. Using our platform, you can create metadata for your documentation assets with forms, edit content using a Markdown editor, and manage your assets in dashboards. Our platform also enables community building through pinning projects by others and following other users who create and engage with other projects. This creates opportunities to connect and collaborate with like-minded people.

## Project Team: Open Sourcerers

- Miranda Chen (yac97)
- Jiani Cheng (jic281)
- Jason Ficorilli (jmf194)
- Tyrica Kapral (tyt3)
- Yue Li (yul478)

# Objective

The objectives of our project include creating an application that is capable of writing and managing project documentation and fostering an ecosystem and community (similar to GitHub), where users can collaborate and share knowledge. To achieve this, the project employed a full-stack technology suite, with front-end technologies including HTML, EJS, CSS, Bootstrap, and JavaScript, while the back-end was developed using Node JS and Express, and MongoDB with Mongoose for the database.
During the design and implementation of the project, we aimed to master the practical application of these technologies and address real issues in collaborative project documentation management. In developing this application, we were keen to learn how to integrate multiple technologies into a seamless workflow and tackle the challenges encountered in actual development, such as how to define models, how to design and implement routes, and how to work on platforms like Glitch as a team.
Beyond the basic requirements, we strove to implement additional features to enhance user experience. For example, we improved UI/UX design and introduced … (need to be more specific). Our goal is to create an app that is both practical and user-friendly.

# Team members' contributions

- **Tyrica Kapral**, as the project/product manager, had a multifaceted role. She managed the overall progression of the project and also engaged in full-stack development, including designing the app, developing the views, and implementing routes, to ensure coordination between the front-end and back-end of the product.
- **Jason Ficorilli** took on the backend responsibilities involving the database and routes. He played a pivotal role in designing the database schema and corresponding Mongoose models, writing the corresponding data handling logic, and ensuring data integrity and security. He also wrote the Rest API routes and middleware for API key validation.
- **Jiani Cheng** and **Yue Li** worked as the backend team for our project and mainly focused on implementing the routes to facilitate the proper transmission of data from the front end to the server and manage CRUD operation to the database.
- **Miranda Chen** was primarily responsible for the front-end development, focusing on enhancing the user interface interaction and front-end logic using JavaScript and jQuery. She also worked on AJAX scripts to handle user input and send requests to the server for processing.

# Technical Architecture

## Models

We implemented our database using MongoDB and the Mongoose ORM in our Node application. Mongoose was very helpful in making it easier to control the data types for each of the attributes, ensure that the objects created and modified in the database conformed to constraints, and autopopulate certain attributes when the obejcts were created it. It was generally easy to work with as an abstraction for working with the database. 

We have the following models:

- **Users**: Create accounts/profiles and assets (Projects, Documents, Pages, Tags)
- **Projects**: Projects contain Documents and are associated with Tags
- **Documents**: Documents contain Pages
- **Pages**: Pages are the simplest component of the assets ("Project stack/super-model")
- **Tags**: Tags are associated with Projects and serve as a way to browse projects currently


## Views

We developed the views using **HTML/EJS**, **CSS** and **Bootstrap**, and **JavaScript**. Using EJS for our templating system made it easy to dynamically populate the views with content from the backend by being able to insert JavaScript directly in HTML. We developed an extensive CSS file, including branding and media queries for responsive design, but we relied heavily on Bootstrap breakpoints for creating responsivity in our site, as well as quick professional styling. We used JavaScript to enhance the aesethics of the site (e.g., sizing and positioning elements based on the viewport). We also used it to add interactivity to the site, such as auto-populating users when entering a user to add to a project.

For the most part, our project uses HTML forms to get input and send data to the backend, and receives data from the response object. In some cases, we have JavaScript functions to fetch data from the server. 

We also used **Moment.js** for parsing, manipulating, and displaying date time values more cleanly/simply.

## Controllers

To develop the backend, we used Node.js as our runtime environment and Express.js as our web framework. We created several routes, organized by the User and Project models (including projects' "children"), the Admin view, and the API. We have routes to render views (R operations) as well as execute CUD operations on objects in the database. 

For views, we sent data from the database in the response object for the frontend implementation. The other routes performed create, update, and delete operations in the database.

We developed many middleware functions to perform common tasks, like ensuring that users are authenticated in order to access routes, validating form input, and manipulating data. 

We used a wide array of packages to implement our controllers:
- **Passport.js**: For session management
- **Bcrypt.js**: For hashing passwords for storage in the database
- **Marked.js**: For converting Markdown in the text editors to HTML to be stored in the database and rendered in the frontend. 
- **Turndown.js**: For converting HTML into Markdown in the text editors.

We also plan to use `santize-html` to sanitize the HTML converted from user-created Markdown to prevent XSS attacks. 
