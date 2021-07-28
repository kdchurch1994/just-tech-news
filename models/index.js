const User = require("./User");
const Post = require("./Post")

module.exports = { User, Post };

//Create associations between the models
User.hasMany(Post, {            //User can make many posts. hasMany is used to establish a one to many relationship
    foreignKey: 'user_id'
});

Post.belongsTo(User, {          //A post can belong to one user, but not many users (A many to one relationship)
    foreignKey: 'user_id',
});