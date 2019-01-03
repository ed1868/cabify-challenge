const express = require('express');

const router = express.Router();

const _ = require('lodash');
const User = require('../models/User');
const Restaurants = require('../models/Restaurants');


router.get('/', (req, res, next) => {
  console.log('----------------', req.user);
  User.find({}, (err, users) => {
    res.status(200).json(users);
  });
});
