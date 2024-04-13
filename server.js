// server.js

// init project
// the following const defining order cannot be changed
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const { connectDB } = require('./DBconnect');

const app = express();

// Connect to the DB
connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Load passport related session
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: 'auto' }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Middleware to setup flash messages, need to check again on this part
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// Set the view engine
app.set("view engine", "ejs")
app.set("views", __dirname + "/views/");

// Load routes
const staticRouter = require("./routes/static");
const userRouter = require("./routes/user");
const projectRouter = require("./routes/project");
const apiRouter = require("./routes/api");

app.use("/", staticRouter);
app.use("/", userRouter);
app.use("/", projectRouter);
app.use("/api/book", apiRouter); // TODO: Update this

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});


