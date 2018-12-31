const express = require('express');

const router = express.Router();
const _ = require('lodash');

const Restaurant = require('../models/Restaurants');


// ///////////RESTAURANT POST ROUTE/////////////


router.post('/', (req, res, next) => {
  const { name, address } = req.body;
  console.log(`This is the Resturant name----${name}`);
  console.log(`This is the Resturant address----${address}`);

  Restaurant.findOne({ address }, 'address', (err, foundRestaurant) => {
    if (foundRestaurant != null) {
      res.status(500).json({ message : 'There Is a Restaurant With this address Already' });
    }
  });


  const newRestaurant = new Restaurant({
    name,
    address,
  });

  newRestaurant.save()
    .then(() => {
      console.log(`YOU HAVE SAVED A NEW RESTAURANT -------${newRestaurant}`);
      res.status(200).json({ message: 'Created' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: `THERE WAS AN ERROR----${err}` });
    });
});


module.exports = router;
