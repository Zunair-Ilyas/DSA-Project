const express = require('express');
const router = express.Router();

const createComment = require('../Controllers/Comments/createComment')
const deleteComment = require('../Controllers/Comments/deleteComment')
const getSingleComment = require('../Controllers/Comments/getSingleComment')
const getAllComments = require('../Controllers/Comments/getAllComments')

router.route('/create-comment').post(createComment)
router.route('/delete-comment/:commentID').delete(deleteComment)
router.route('/:commentID').get(getSingleComment)
router.route('/:postID/:commentID').get(getAllComments)

module.exports = router