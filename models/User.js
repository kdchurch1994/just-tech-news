const bcrypt = require('bcrypt');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our User model
class User extends Model {}

// define table columns and configuration
User.init(
    {
        // TABLE COLUMN DEFINITIONS GO HERE
        // define an id column
        id: {
            type: DataTypes.INTEGER, // use the special Sequelize DataTypes object to provide what type of data it is (In this case it is an integer)
            allowNull: false, // this is the equivalent of SQL's `NOT NULL` option
            primaryKey: true, // instruct that this is the Primary Key
            autoIncrement: true // turn on auto increment
        },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // there cannot be any duplicate email values in this table
        // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4] // this means the password must be at least four characters long
            }
        }
    },
    {
        hooks: {
            // First way to do it but it is a bit clunky and hard to follow
            // set up beforeCreate lifecycle "hook" functionality
            // beforeCreate(userData) { //We use this hook to execute the bcrypt hash function on the plaintext password
            //     return bcrypt.hash(userData.password, 10).then(newUserData => { // We pass the bcypt has function in the userData object that contains the plaintext password in the password property. We also pass in a saltRound value of 10
            //         // The resulting hashed password is then passed to the Promise object as a newUserData object with a hashed password property.
            //         return newUserData // The return statement then exists out of the function, returning the hashed passowrd in the newUserData function.
            //     });
            // }

            // Second and more precise way of doing it
            async beforeCreate(newUserData) { // The async keyword is used as a prefix to the function that contains the asynchronous function. 
                newUserData.password = await bcrypt.hash(newUserData.password, 10); // await can be used to prefix the async function, which will then gracefully assign the value from the response to the newUserData's password property.
                return newUserData; //The newUserData is then returned to the application with the hashed password.
            }
        }
    },
    {
        // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))
        sequelize, // pass in our imported sequelize connection (the direct connection to our database)
        timestamps: false, // don't automatically create createdAt/updatedAt timestamp fields
        freezeTableName: true, // don't pluralize name of database table
        underscored: true, // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        modelName: 'user' // make it so our model name stays lowercase in the database
    }
);

module.exports = User;