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