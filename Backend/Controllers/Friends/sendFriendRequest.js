const User = require('../../Models/User')
const statusCode = require('http-status-codes')
const express = require('express')

const SendFriendRequest = async (req, res) => {
    const {senderID, receiverID} = req.body

    try {
        const sender = await User.findById(senderID)
        const receiver = await User.findById(receiverID)

        if (!sender || !receiver) {
            return res.status(statusCode.NOT_FOUND).json({message: 'User not found'})
        }

        if (receiver.blockedUsers.includes(senderID)) {
            return res.status(statusCode.FORBIDDEN).json({message: 'You are blocked by this user and cannot send a friend request.'})
        }

        if (sender.blockedUsers.includes(receiverID)) {
            return res.status(statusCode.FORBIDDEN).json({message: 'You have blocked this user.'})
        }

        if (sender.friends.includes(receiverID)) {
            return res.status(statusCode.BAD_REQUEST).json({message: 'You are already friends.'})
        }
        if (sender.friendRequestsSent.includes(receiverID)) {
            return res.status(statusCode.BAD_REQUEST).json({message: 'Friend request already sent.'})
        }

        sender.friendRequestsSent.push(receiverID)
        receiver.friendRequestsReceived.push(senderID)

        await sender.save()
        await receiver.save()

        res.status(statusCode.CREATED).json({message: 'Friend request sent.'})
    } catch (e) {
        console.error(e)
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: e.message})
    }
}

module.exports = SendFriendRequest;