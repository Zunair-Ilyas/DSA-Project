const express = require('express');
const Post = require('../../Models/Post')
const statusCodes = require('http-status-codes');

const getPostLikes = async (req, res) => {
    const {postID} = req.params;

    try {
        const post = await Post.findById(postID).populate('likes', '_id userName')

        if (!post) {
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Post not found' });
        }

        return res.status(statusCodes.OK).json({
            message: 'Likes retrieved successfully',
            likes: post.likes,
        });
    } catch (e) {
        console.error(e)
        return res.status(stausCode.INTERNAL_SERVER_ERROR).json({message: e.message})
    }
}

module.exports = getPostLikes;