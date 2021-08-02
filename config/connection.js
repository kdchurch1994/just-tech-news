// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

require('dotenv').config();

// create the connection to our database, pass in your MySQL information for username and password (takes this info from the .env file)
let sequelize;
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {                                                                                    //See notes on 13.5.6 Deploy to Heroku
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {//When the app is deployed, it will have access to Heroku's process.env.JAWSDB_URL variable and use that value to connect. Otherwise, it will continue using the localhost configuration.
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
    });
}


module.exports = sequelize;