const express = require('express');
const passport = require('passport');

const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const User = require('../models/User');
const Restaurants = require('../models/Restaurants');
// Bcrypt to encrypt passwords
const bcryptSalt = 10;


// GET ALL EATERS ROUTE//

router.get('/', (req, res, next) => {
  User.find({}, (err, users) => {
    res.status(200).json(users);
  });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', { message: req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  // const username = req.body.username;
  // const email = req.body.email;
  // const password = req.body.password;
  const { username, email, password } = req.body;
  console.log(`This is the Eater username -- ${username}`);
  console.log(`This is the Eater email -- ${email}`);

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('auth/signup', { message: 'The username already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashPass,
    });

    newUser.save()
      .then(() => {
        console.log(newUser);
        res.status(200).json(newUser);
      })
      .catch((err) => {
        console.log(err);
        res.render('auth/signup', { message: 'Something went wrong' });
      });
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


// //////////////EATER DELETE && RESTAURANT DELETE//////////////

router.delete('/', (req, res, next) => {
  User.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
    }
  });

  Restaurants.deleteMany({}).then(() => {
    res.status(200).json({ message: 'EATERS AND RESTAURANTS REMOVED' });
  }).catch((err) => {
    console.log(err);
    res.status(500).json({ message: `THERE HAS BEEN AN ERROR---------${err}` });
  });
});

module.exports = router;
