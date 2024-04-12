// passport logic
// helper for the login function of user.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Configure passport local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'login', // use 'login' to accept both email and username
      passwordField: 'password',
    },
    async (login, password, done) => {
      let user;
      try {
        // Check if login is a username or email
        user = await User.findOne({
          $or: [{ email: login }, { username: login }],
        });

        if (!user) {
          return done(null, false, {
            message: 'The email or username you entered is not registered.',
          });
        }
        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, {
            message: 'You entered invalid login credentials.',
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
