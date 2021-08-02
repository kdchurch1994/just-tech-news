const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Vote } = require('../../models'); //*Refer to Notes.txt to learn more
//Route that will retrieve all posts in the database. (Use findAll)
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
        attributes: [
            'id', 
            'post_url', 
            'title', 
            'created_at'
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'] //Instead of trying to predict and build a method for every possible use developers have for SQL databases, 
            //Sequelize provides us with a special method called .lieral() that allows us to run regular SQL queries from within the Sequelize method-based queries. So when we vote on a post, we'll see that post - and its updated vote total - in the response. 
        ], //customizing the attributes to include the columns we want from the post table.  
        order: [['created_at', 'DESC']], //ensures that the latest articles are shown first to the client.                                                        
        include: [  //creates a JOIN to the User table, which is done by adding the proptery include. Notice that the include property is expressed as an array of objects.
            {       //To define this object, we need a reference to the model and attributes. 
                model: User,
                attributes: ['username']
            }

        ]
    }) //Now that the query is done, we need to create a Promise that captues the response from the database call.
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//GET a single post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: { //We used the where property to set the value of the id using req.params.id. Will find posts associated with a particular user_id
            id: req.params.id
        },
        attributes: [
            'id', 
            'post_url', 
            'title', 
            'created_at',
            [sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'] //Instead of trying to predict and build a method for every possible use developers have for SQL databases, 
            //Sequelize provides us with a special method called .lieral() that allows us to run regular SQL queries from within the Sequelize method-based queries. So when we vote on a post, we'll see that post - and its updated vote total - in the response. 
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Create a Post
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// PUT /api/posts/upvote that involves to queries; first, using the Vote model to create a vote, then querying on that post to get an updated vote count.
router.put('/upvote', (req, res) => { //goes before /:id or Express.js will think the wor "upvote" is a valid parameter for /:id
    // Custom static method created in models/Post.js
    Post.upvote(req.body, { Vote })
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        { 
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Update a Post's Title
router.put('/:id', (req, res) => { //Notice that we used the request parameter to find the post, the used the req.body.title value to replace the title of the post. 
    Post.update(                   // In the response, we sent back data that has been modified and stored in the database.
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }    
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Delete a Post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id   
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router; //Make sure to update index.js file in the api folder
