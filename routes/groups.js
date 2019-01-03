const express = require('express');

const router = express.Router();

const _ = require('lodash');
const User = require('../models/User');
const Restaurants = require('../models/Restaurants');
const Group = require('../models/Groups');


router.get('/', (req, res, next) => {
  console.log('----------------', req.user);
  Group.find({}, (err, groups) => {
    res.status(200).json(groups);
  });
});


module.exports = router;
