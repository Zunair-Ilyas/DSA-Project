// Required Modules
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../Models/User'); // Assuming you have a User model

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Login Controller
const loginController = async (req, res) => {
    const { email, password } = req.query; // Expecting email and password in query params

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Payload, using email here
            JWT_SECRET, // Secret key
            { expiresIn: '1h' } // Token expiration time
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                userName: user.userName,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = loginController;
