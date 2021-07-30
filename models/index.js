const User = require("./User");
const Post = require("./Post")
const Vote = require("./Vote");



//Create associations between the models
User.hasMany(Post, {            //User can make many posts. hasMany is used to establish a one to many relationship
    foreignKey: 'user_id'
});

Post.belongsTo(User, {          //A post can belong to one user, but not many users (A many to one relationship)
    foreignKey: 'user_id',
});

User.belongsToMany(Post, {      //With these two .belongsToMany() methods in place, we're allowing both the User and Post models to query each other's information in the context of a vote.
    through: Vote,              //If we want to see which users voted on a single post, we can now do that. If we want to see which posts a single user voted on, we can see that too. 
    as: 'voted_posts',          //This makes the data more robust and gives us more capabilites for visualizing this data on the client-side.
    foreignKey: 'user_id'       //Notice the syntax. We instruc the application that the User and Post models will be connected, but in this case through the Vote model.
});                             //We state what we want the foreign key to be in Vote, which aligns with the fields we set up in the model.
                                //We also stipulate that the name of the Vote model should be displayed as voted_posts, when queired on, making it a litte more informative. 
Post.belongsToMany(User, {      //Frthermore, the Vote table needs a row of data to be a unique pairing so that it knows which data to pull in when queried on.
    through: Vote,              //So because the user_id and post_id pairing must be unique, we're protected from the possibility of a suingle user voting on one post multiple times. 
    as: 'voted_posts',          //This layer of protection is called a foreign key constraint. 
    foreignKey: 'post_id"'
});

Vote.belongsTo(User, {          //By also creating one-to-many associations directly between these models, we can perform aggregated SQL functions between models.
    foreignKey: 'user_id'       //In this case, we'll see a total count of votes for a single post when queried. This would be difficult if we hadn't directly associated the Vote model with the other two.
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote };