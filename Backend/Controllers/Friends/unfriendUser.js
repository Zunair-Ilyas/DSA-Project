const express = require('express');
const User = require('../../Models/User');
const statusCode = require('http-status-codes');

const unfriendUser = async (req, res) => {
    const { senderID, receiverID } = req.body;

    try {
        const sender = await User.findById(senderID);
        const receiver = await User.findById(receiverID);

        if (!sender || !receiver) {
            return res.status(statusCode.NOT_FOUND).json({ message: 'User(s) not found.' });
        }

        if (!sender.friends.includes(receiverID) || !receiver.friends.includes(senderID)) {
            return res.status(statusCode.BAD_REQUEST).json({ message: 'You are not friends with this user.' });
        }

        sender.friends.pull(receiverID)
        receiver.friends.pull(senderID)

        sender.friendRequestsSent.pull(receiverID)
        receiver.friendRequestsReceived.pull(senderID)

        await sender.save();
        await receiver.save();

        res.status(statusCode.OK).json({ message: 'You have unfriended the user successfully.' });
    } catch (e) {
        console.error(e);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: e.message });
    }
};

module.exports = unfriendUser;
