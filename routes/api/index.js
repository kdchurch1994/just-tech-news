// This file serves as a means to collect all of the API routes and package them up for us. This file allows us to keep the API endpoints nice and organized while allowing the API to be scalable. 
const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);

module.exports = router;

// Remember how in user-routes.js we didn't use the word users in any routes? That's because in the file we take those routes and implement them to another router instance, prefixing them with the path /users at the time.