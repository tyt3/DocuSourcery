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
- **Pages**: Pages are the simplest component of the "Project stack/super-model"
- **Tags**: Tags are associated with Projects and serve as a way to browse projects currently


## Views

We developed the views using HTML/EJS, CSS and Bootstrap, and JavaScript. EJS made it 

## Controllers

# Challenges

- Defining the database schema (changed as we developed the project)
- Defining routes
- Figuring out how to order routes
- Figuring out how to implement flash messages
- Glitch project not loading

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
- To access the features of CRUD features, you will have to [sign up for an account](https://docusourcery.glitch.me/signup) and login.
- To access the admin view, [login into the admin account](https://docusourcery.glitch.me/admin/login) using the following credentials: 
```
username: admin
password: M3rl1n!
```
