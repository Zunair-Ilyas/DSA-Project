const express = require('express');
const Post = require('../../Models/Post')
const statusCodes = require('http-status-codes');

const toggleLikePost = async (req, res) => {
    const { postID } = req.params;
    const { userID } = req.body;

    try {
        const post = await Post.findById(postID);

        if (!post) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Post not found' });
        }

        const isLiked = post.likes.includes(userID);
        if (isLiked) {
            post.likes.pull(userID)
        } else {
            post.likes.push(userID);
        }
        await post.save();

        return res.status(statusCodes.OK).json({ message: isLiked ? 'Post unliked' : 'Post liked', post });
    } catch (e) {
        console.error(e);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
}

module.exports = toggleLikePost;