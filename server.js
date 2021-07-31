const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes 
app.use(routes);

// Turn on connection to db and server
sequelize.sync({ force: false }).then(() => {               //If sequelize.sync force is set to false, then the tables are not dropped and recreated if there are association changes. 
    app.listen(PORT, () => console.log('Now listening'));  //By setting it to true, we will make the tables re-create if there are any association changes. This will also result in the tables being constantly dropped everytime and recreated, which can be annoying. 
});                                                        //It is best to set this to false when deploying the site.

// Since we set up the routes the way we did, we don't have to worry about importing multiple files for different endpoints. The router instance in routes/index.js collected everything for us and packed them up for server.js to use.
// Also, note we're importing the connection to Sequelize from config/connection.js. Then, at the bottom of the file, we use the sequelize.sync() method to establish the connection to the database.
// The "sync" part means that this is Sequelize taking the models and connecting them to associated database tables. If it doesn't find a table, it'll create it for you!