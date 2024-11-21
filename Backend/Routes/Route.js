const express = require('express');
const router = express.Router();
const friendsRoutes = require('./friendsRoutes')
const postRoutes = require('./postRoutes')
const commentRoutes = require('./commentRoutes')

router.use('/friends', friendsRoutes);
router.use('/post', postRoutes);
router.use('/post/comment', commentRoutes)

module.exports = router;