// server.js

// init project
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { connectDB } = require('./DBconnect');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.use("/api/book", apiRouter);


// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

