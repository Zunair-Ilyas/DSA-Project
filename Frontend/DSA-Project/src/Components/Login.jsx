import React, { useState, createContext, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/Logo.svg';
import './Login.css';

// Create a context for user information
export const UserContext = createContext(null);

// Custom hook to use user context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userId', userData._id); // Save user ID separately
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userId'); // Remove user ID
    };

    // Try to load user from localStorage on initial load
    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const { login } = useUser();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        // Basic validation
        const errors = {};
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.password) errors.password = 'Password is required';

        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.get('http://localhost:2011/friends/login', {
                    params: {
                        email: formData.email,
                        password: formData.password,
                    },
                });
                console.log(response.data.user)
                const userData = {
                    _id: response.data.user.id,
                    email: response.data.user.email,
                    userName: response.data.user.userName,
                    fullName: response.data.user.fullName
                };

                localStorage.setItem('token', response.data.token);

                login(userData);

                navigate('/home');
            } catch (error) {
                if (error.response) {
                    setLoginError(error.response.data.message || 'Login failed. Please try again.');
                } else if (error.request) {
                    setLoginError('No response from server. Please check your connection.');
                } else {
                    setLoginError(error.message || 'An error occurred. Please try again.');
                }
            }
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-card">
                <img src={logo} className="registration-logo" alt="Logo" />
                <h1 className="registration-heading">Sign In to Your Account</h1>

                {loginError && (
                    <div className="error-message" style={{ marginBottom: '20px', textAlign: 'center' }}>
                        {loginError}
                    </div>
                )}

                <form className="registration-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            required
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>

                    <button type="submit" className="submit-button">
                        Sign In
                    </button>
                </form>

                <div className="login-redirect">
                    Don't have an account? <Link to="/register-step-one" className="login-link">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;