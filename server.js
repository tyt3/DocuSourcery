// server.js

// init project
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { connectDB } = require('./DBconnect');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to the DB
connectDB();

// Set the view engine
app.set("view engine", "ejs")
app.set("views", __dirname + "/views/");

// Load routes
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const projectRouter = require("./routes/project");
const apiRouter = require("./routes/api");

app.use("/", indexRouter);
app.use("/", userRouter);
app.use("/", projectRouter);
app.use("/api/book", apiRouter); // Make sure to change this


// Start the server
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

