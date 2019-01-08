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

    if (eatersArray.includes(leader)) {
      const leaderIndex = eatersArray.indexOf(leader);
      eatersArray.splice(leaderIndex, 1);
    }

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

      Group.find({}, (err, groups) => {
        // _.forEach(groups, (group) => {
        //   if (group.leader0 === leader) {
        //     console.log("it's the same leader");
        //   }
        // });
        groups.sort((a, b) => b - a);
        console.log(groups[0]);
        console.log('WHAT THE FUCK IS THE GROUP LEADER', groups[0].leader);
        console.log('THIS IS THE CURRENT FUCKING LEADER', leader);
        if (groups[0].leader !==  leader) {
          console.log('WHAT THE FUCK IS THE GROUP LEADER', groups[0].leader);
          res.status(400).json(({ message: 'YOU JUST MADE A GROUP ALREADY... WAIT A WEEK' }));
        } else {
          console.log('leader is fair');
        }
      });

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
});

module.exports = router;
