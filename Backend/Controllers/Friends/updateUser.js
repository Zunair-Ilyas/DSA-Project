const User = require("../../Models/User");
const jwt = require('jsonwebtoken');
const statusCode = require('http-status-codes');
const bcrypt = require('bcryptjs');

const bcryptSalt = bcrypt.genSaltSync(10);

const updateUser = async (req, res) => {
    const {
        userName,
        email,
        password,
        fullName,
        bio,
        profilePicture,
        location,
        dateOfBirth,
        gender,
        friends,
        friendRequestsSent,
        friendRequestsReceived,
        blockedUsers,
        posts,
    } = req.body;

    try {
        const {userID} = req.params

        if (!userID) {
            return res.status(statusCode.BAD_REQUEST).json({
                message: "User ID is required for update"
            });
        }

        const user = await User.findById(userID);

        if (!user) {
            return res.status(statusCode.NOT_FOUND).json({
                message: "User not found"
            });
        }

        // Update fields if provided
        if (userName) user.userName = userName;
        if (email) user.email = email;

        // Hash password if provided
        if (password) {
            const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
            user.password = hashedPassword;
        }

        if (fullName) user.fullName = fullName;
        if (bio) user.bio = bio;

        // Ensure profilePicture is a string
        if (profilePicture) {
            user.profilePicture = typeof profilePicture === 'string' ? profilePicture : '';
        }

        if (location) user.location = location;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (gender) user.gender = gender;

        // Update arrays if provided
        if (friends) user.friends = friends;
        if (friendRequestsSent) user.friendRequestsSent = friendRequestsSent;
        if (friendRequestsReceived) user.friendRequestsReceived = friendRequestsReceived;
        if (blockedUsers) user.blockedUsers = blockedUsers;
        if (posts) user.posts = posts;

        // Save the updated user
        await user.save();

        // Regenerate JWT token
        jwt.sign({user}, process.env.JWT_SECRET, {}, (err, token) => {
            if (err) {
                return res.status(statusCode.UNAUTHORIZED).json({
                    message: `Unable to authenticate with JWT ${token}`
                });
            }
            res.status(statusCode.OK).json({
                message: `User updated and authenticated with JWT ${token}`,
                token,
                user
            });
        });

        console.log(req.body);
    } catch (e) {
        console.log(e);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: e.message});
    }
};

module.exports = updateUser;