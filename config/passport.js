const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const msg = {
  wrongPassword: 'Password incorrect.',
  notRegistered: 'That email is not registered.'
};

const authenticateUser = (email, password, done) => {
  return User.findOne({ email: email })
    .then(user => {
      if (!user) return done(null, false, msg.notRegistered);

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, msg.wrongPassword);
        }
      });
    })
    .catch(err => done(err));
};

module.exports = (passport) => {
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    return User.findById(id, (err, user) => done(err, user));
  });
};
