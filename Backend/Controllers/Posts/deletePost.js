const express = require('express');
const Post = require('../../Models/Post')
const User = require('../../Models/User')
const statusCode = require('http-status-codes');

const deletePost = async (req, res) => {
    const {postID} = req.params;
    const {userID} = req.body;

    try {
        const deletedPost = await Post.findByIdAndDelete(postID)

        if (!deletedPost) {
            return res.status(statusCode.NOT_FOUND).json({ message: 'Post not found.' });
        }

        await User.findByIdAndUpdate(userID, {$pull: {post: postID}})

        return res.status(statusCode.OK).json({message: 'Post deleted'})
    } catch (e) {
        console.error(e)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({message: e.message})
    }
}

module.exports = deletePost;