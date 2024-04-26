# Introduction

## Project Team: Open Sourcerers

- Miranda Chen (yac97)
- Jiani Cheng (jic281)
- Jason Ficorilli (jmf194)
- Tyrica Kapral (tyt3)
- Yue Li (yul478)

Our project, **DocuSourcery**, is a lightweight web app for creating, organizing, and publishing project documentation. Using our platform, you can create metadata for your documentation assets with forms, edit content using a Markdown editor, and manage your assets in dashboards. Our platform also enables community building through pinning projects by others and following other users who create and engage with other projects. This creates opportunities to connect and collaborate with like-minded people.

# Objective

The objectives of our project include creating an application that is capable of writing and managing project documentation and fostering an ecosystem and community (similar to GitHub), where users can collaborate and share knowledge. To achieve this, the project employed a full-stack technology suite, with front-end technologies including HTML, EJS, CSS, Bootstrap, and JavaScript, while the back-end was developed using Node JS and Express, and MongoDB with Mongoose for the database.
During the design and implementation of the project, we aimed to master the practical application of these technologies and address real issues in collaborative project documentation management. In developing this application, we were keen to learn how to integrate multiple technologies into a seamless workflow and tackle the challenges encountered in actual development, such as how to define models, how to design and implement routes, and how to work on platforms like Glitch as a team.
Beyond the basic requirements, we strove to implement additional features to enhance user experience. For example, we improved UI/UX design and introduced … (need to be more specific). Our goal is to create an app that is both practical and user-friendly.

# Team member’s contributions

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

# Challenges

- **Defining the database schema/models**: We spent a lot of time deciding how to design our schema, particularly what data points would be necessary to implement the functionality we wanted in our site and how each of the models would be interrelated in our complex app. A lot of deliberation went into how to do foreign key linkages, and we went back and forth between using only Object IDs and nesting the Object IDs in objects so that we could access data for related objects without having to populate them. We ultimately decided on the latter to simplify the frontend development, though it added more steps on the backend. It was especially difficult when more info is needed than just the ID (e.g., attaching users with roles to projects). The schema evolved as we developed, which caused issues with existing code in the controllers and the views that referred to the models' attributes in particular ways. We had to debug and rewrite our code after model changes.
- **Defining routes**: This was sometimes tricky becuase we had to make sure to order them properly so that requests went to the right route and not an earlier route. We also discovered that the PUT and DELETE methods weren't supported, which meant reorganizing our routes and updating views that used routes that weren't supported. Because our application was so complex, we spent a lot of time in the intial definitons of our routes, but found ourselves adding additional routes to implement frontend functionality and adjust predefined routes. 
- **Working in Glitch**: One of the biggest issues was figuring out our workflow by not develeping directly in Glitch to avoid losing work, as we were also using the GitHub integration. This also caused confusion because Glitch publishes to a `gltich` branch, which is not used when we go through the "Import" process supported by Glitch (which used the `main` branch). It took some time to figure out how to go about writing and publishing our code. 
- **Issues with packages**: We had some trouble figuring out how to use certain packages, which meant that some implementations didn't make it into our final product (yet), including using `connect-flash` for flashing messages on the frontend and `DOMPurify` for santizing HTML. 


# Future Work

- Features that we started but have not yet completed include "pretty" error handling (frontend pages and flashed messages), searching projects using keywords, and filtering projects. These will be important features to develop in the future.
- A feature we would like to add is social networking. By integrating a social aspect, we could foster community interaction to enhance our present user engagement, and to facilitate collaboration on documentation projects. However, due to time constraints, we didn’t include this part in our current project.
- Another important feature to add to the application is version control to enable keeping track of collaborators’ contributions to documentation and reverting back to previous versions.
- We may be interested in learning social graph databases and some cloud services such as AWS and Azure to help manage scalable infrastructure for handling larger user groups.

# Conclusion

In this course, we were engaged with front-end technologies like HTML5, CSS, Bootstrap and responsive design, JavaScript, and several JS frameworks, as well as back-end technologies like Node.js, Express.js, and MongoDB. Working with a variety of technologies along the tech stack has significantly expanded our skillset, and combined with the practical experience of developing on Glitch, we have great examples to showcase our skills in our portfolios.

For future iterations of this course, we think it might be beneficial to include the following aspects:

- **Version Control**: More introduction on version control flow like on git to help us collaborate better could be incredibly useful not only for team project, but also for future careers.
- **DevOps**: More introductions to DevOps practices such as CI/CD could provide more valuable skills for the full life cycle of web application development.
- **Testing topics**: More introduction to automated testing, such as Jest or Mocha could prepare us better to maintain good code quality.

# Resources

- **[W3Schools](https://www.w3schools.com)**: We used several tutorials on this site to learn how to work with CSS, Node, and MongoDB. 
- **[Bootstrap documentation](https://getbootstrap.com/docs)**: The Bootstrap documentation was essential throughout the front-end development of the project.
- **[Google Fonts Material Symbols](https://fonts.google.com/icons)**: All of our icons come from Material Symbols 
- **Package documentation**: We used the documentation as reference for using many of our packages, including the following:
  - **[Express.js](https://expressjs.com/en/5x/api.html)**:
  - **[Passport.js](https://www.passportjs.org/concepts/authentication/)**:
  - **[Marked.js](https://marked.js.org/)**: Marked was the second option we used for converting Markdown to HTML, after Markdown.js, and the project documentation was very helpful. 
  - **[Turndown.js](https://github.com/mixmark-io/turndown)**: The Turndown GitHub repo and website were really helpful for figuring out how to use the service along with special options for converting HTML to Markdown in the editors of the web app.  

# Testing the Site
- You can view the [Home](https://docusourcery.glitch.me/), [About](https://docusourcery.glitch.me/about), [Projects](https://docusourcery.glitch.me/projects), project, tags, and profile pages without signing up for an account. 
- To create, update, and delete accounts and assets, you will have to [sign up for an account](https://docusourcery.glitch.me/signup) and login.
- To access the **admin view**, [login into the admin account](https://docusourcery.glitch.me/admin/login) using the following credentials: 
```
username: admin
password: M3rl1n!
```