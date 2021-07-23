const router = require('express').Router(); // Imports the Express.js router functionality
const { User } = require('../../models'); // Imports User from the User.js model

// GET /api/users (Gets all info from the users table)
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({ // Allows us to query all of the users from the user table in the database (equivalent to `SELECT * FROM users;`)
        attributes: { exclude: ['password']}
    })
        .then(dbUserData => res.json(dbUserData)) // After selecing all of the users from the database it responds with the data as JSON
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1 (Get user info for one user based on the id. The /1 provides a route to the user with the id of 1, whereas /99 provides a route to the user with the id of 99)
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users (Allows us to create a user and add that user to the database)
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// PUT /api/users/1 (Allows us to update the user's info based on the id of that user)
router.put('/:id', (req, res) => {
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1 (Allows us to delete a user based on their id)
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router; 