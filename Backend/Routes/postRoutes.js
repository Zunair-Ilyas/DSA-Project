const express = require('express');
const router = express.Router();

const createPost = require('../Controllers/Posts/createPost')
const updatePost = require('../Controllers/Posts/updatePost')
const deletePost = require('../Controllers/Posts/deletePost')
const getSinglePost = require('../Controllers/Posts/getSinglePost')
const getUserPosts = require('../Controllers/Posts/getUserPosts')
const toggleLikePost = require('../Controllers/Posts/toggleLike')
const getPostLikes = require('../Controllers/Posts/getPostLikes')
const getAllPosts = require('../Controllers/Posts/getAllPosts')

router.route('/').post(createPost)
router.route('/:postID').put(updatePost)
router.route('/:postID').delete(deletePost)
router.route('/:postID').get(getSinglePost)
router.route('/').get(getUserPosts)
router.route('/:postID').post(toggleLikePost)
router.route('/:postID').get(getPostLikes)
// Fix the route to pass the userID as part of the path
router.route('/getAllPosts/:userID').get(getAllPosts)

module.exports = router;
