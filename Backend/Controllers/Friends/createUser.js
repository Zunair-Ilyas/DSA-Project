const User = require('../../Models/User');
const jwt = require('jsonwebtoken');
const statusCode = require('http-status-codes');
const bcrypt = require('bcryptjs')

const bcryptSalt = bcrypt.genSaltSync(10);

const createUser = async (req, res) => {
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
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
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
        })

        jwt.sign({user}, process.env.JWT_SECRET, {}, (err, token) => {
            if (err) {
                return res.status(statusCode.UNAUTHORIZED).json({message: `Unable to authenticate with JWT ${token}`});
            }
            res.status(statusCode.CREATED).json({message: `Authenticated with JWT ${token}`, token, user});
        })
    } catch (e) {
        console.log(e);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({error: e.message})
    }
}

module.exports = createUser;