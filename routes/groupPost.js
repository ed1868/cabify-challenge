const express = require('express');

const router = express.Router();

const _ = require('lodash');
const User = require('../models/User');
const Group = require('../models/Groups');
const Restaurants = require('../models/Restaurants');

router.get('/', (req, res, next) => {
  const leader = req.user.username;
  const username = '';
  let restaurantName = '';
  const restaurantArr = [];
  let randomRestaurant = '';
  const eaters = [];
  const eatersArray = [];

  hasDuplicates = (array) => {
    const valuesSoFar = Object.create(null);
    for (let i = 0; i < array.length; ++i) {
      const value = array[i];
      if (value in valuesSoFar) {
        return value;
      }
      valuesSoFar[value] = true;
    }
    return false;
  };

  createRandomEater = array => array[Math.floor(Math.random() * array.length)];

  User.find({}, (err, users) => {
    _.forEach(users, (user) => {
      const username = user.username;
      return eatersArray.push(username);
    });

    for (let i = 0; i < eatersArray.length; i++) {
      if (eaters.length <= 3) {
        randomEater = createRandomEater(eatersArray);
        eaters.push(randomEater);
      }
    }

    const duplicate = hasDuplicates(eaters);
    for (let a = 1; a < eaters.length; a++) {
      if (eaters[a] === duplicate) {
        const index = eaters.indexOf(duplicate);
        eaters.splice(index, 1);
      }
    }

    Restaurants.find({}, (err, restaurants) => {
      _.forEach(restaurants, (restaurant) => {
        restaurantName = restaurant.name;
        restaurantArr.push(restaurantName);
      });

      randomRestaurant = createRandomEater(restaurantArr);

      const newGroup = new Group({
        leader,
        eaters,
        randomRestaurant,
      });
      console.log(newGroup);

      Group.create({
        leader,
        eaters,
        restaurant: randomRestaurant,
      }).then((savedGroup) => {
        console.log('YOU HAVE SAVED', savedGroup);
        res.status(200).json(savedGroup);
      }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong', err });
      });
    });
  });

  // res.status(200).json(leader);
});

module.exports = router;
