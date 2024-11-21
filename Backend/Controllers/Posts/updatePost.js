const express = require('express')
const Post = require('../../Models/Post')
const statusCode = require('http-status-codes')
const acceptFriendRequest = require("../Friends/acceptFriendRequest");

const updatePost = async (req, res) => {
    const {postID} = req.params
    const {content, media, isPublic} = req.body

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            postID,
            {content, media, isPublic},
            {new: true}
        )

        if (!updatedPost) {
            return res.status(statusCode.NOT_FOUND).json({message: 'Post not found'})
        }

        return res.status(statusCode.OK).json({message: 'Post updated', post: updatedPost})
    } catch (e) {
        console.error(e)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({message: e.message})
    }
}

module.exports = updatePost;