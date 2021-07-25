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

router.post('/login', (req, res) => { // We queried the user table using the findOne() method for the email entered by the user and assigned it to req.body.email
    User.findOne({                    // If the user with that email was not found in the database, the next step will be to verify the user's iedntity by matching the password from the user and the hashed password in the database. 
        where: {                      // This will be done in the Promise of the query. The .findOne() Sequelize method looks for a user with the specified email. The result of the query is passed as dbUserData to the .then() part of the .findOne() method. 
            email: req.body.email     // If the query result is successful (i.e., not empty), we can call .checkPassword(), which will be on the dbUserData object. We will need to pass the plaintext password, which is stored in req.body.password, into .checkPassword() as the argument.
        }
    }) .then (dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }
        // Verify user

        const validPassword = dbUserData.checkPassword(req.body.password); // The .compareSync() method, which is inside the .checkPassword() method in the User5.js model, can then confirm or deny that the supplied password matches the hashed password stored on the object.
                                                                           // .checkPassword() will then return true on success or false on failure. We stored that boolean value to the variable validPassword.
        if (!validPassword) {                                              // Note that the instance method was called on the user retrieved from the database, dbUserData. Because the instance method returns a Boolean, we can use it in a conditional statement to verify whether the user has been verified or not. 
            res.status(400).json({ message: 'Incorrect password!' });      // In the conditional statement, if the match returns a false value, an error message is sent back to the client, and the return statmenet exits out of the function immediately. 
            return;                                                        // If there is a match, the conditional statement block is ignored, and a response with the data and the message "You are now logged in." is sent instead.      
        }

        res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
});

// PUT /api/users/1 (Allows us to update the user's info based on the id of that user)
router.put('/:id', (req, res) => {
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        indvidualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id'});
                return;
            }
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