// This file collects the packaged group of API endpoints and prefixes them with the path /api.
// Also, note that second use of router.use(). This is so if we make a request to any endpoint that doesn't exist, we'll receive a 404 error indicating we have requested an incorrect resource
const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => {
    res.statusCode(404).end();
});

module.exports = router; 