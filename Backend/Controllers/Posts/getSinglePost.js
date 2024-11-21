const express = require('express');
const Post = require('../../Models/Post')
const statusCodes = require('http-status-codes');

const getSinglePost = async (req, res) => {
    const {postID} = req.params;

    try {
        const post = await Post.findById(postID).populate('user', 'name');

        if (!post) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Post not found' });
        }

        return res.status(statusCodes.OK).json(post);
    } catch (e) {
        console.error(e);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
}

module.exports = getSinglePost;