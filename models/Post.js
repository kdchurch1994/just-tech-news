const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create our Post model
class Post extends Model {}

// create fields/columns for Post model
Post.init( // Define the Post Schema
    {
        id: { //Primary Key that is set to auto-increment for each post that is created.
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { // validation used to verify that the URL is an actual verified link. If isURL was set to false, it would not matter if it is a verified url or not.
                isURL: true
            }
        },
        user_id: { //Used to determine who posted the news article
            type: DataTypes.INTEGER,
            references: { //Using the references property, we establish the relationship between this post and the user by creating a reference to the User model,
                          //specifically to the id column that is defned by the key property, which is the primary key. The user_id in this case is defined as the foriegn key
                model: 'user', 
                key: 'id'
            }
        }
    },
    {
        sequelize, 
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post; //Export expression to make the Post model accessible to other parts of the application