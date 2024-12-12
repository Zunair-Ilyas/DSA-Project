import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './RegistrationStepTwo.css';
import logo from "../assets/Logo.svg";
import axios from "axios";

const RegistrationStepTwo = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        ...location.state.formData,
        gender: '',
        location: '',
        bio: '',
        profilePicture: '',
        dateOfBirth: '',
    });

    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profilePicture: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};

        if (!formData.gender) errors.gender = 'Gender is required';
        if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of Birth is required';
        if (!formData.profilePicture) errors.profilePicture = 'Profile picture is required';

        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            try {
                const data = {
                    userName: formData.userName,
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    bio: formData.bio,
                    location: formData.location,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    profilePicture: formData.profilePicture,
                    friends: [],
                    friendRequestsSent: [],
                    friendRequestsReceived: [],
                    blockedUsers: [],
                    posts: [],
                };

                const response = await axios.post('http://localhost:2011/friends/register', data);

                if (response.status === 201) {
                    console.log('Registration successful:', response.data);
                    navigate('/home');
                } else {
                    console.error('Registration failed');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    };

    const handleButtonClick = () => {
        document.getElementById('profilePictureInput').click();
    };

    return (
        <div className="registration-container-two">
            <div className="registration-card-two">
                <img src={logo} className="registration-logo-two" alt="Logo"/>
                <h1 className="registration-heading-two">Complete Your Profile</h1>

                <form className="registration-form-two" onSubmit={handleSubmit}>
                    <div className="form-group-two">
                        <label htmlFor="gender">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="form-input-two"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        {errors.gender && <p className="error-message-two">{errors.gender}</p>}
                    </div>

                    <div className="form-group-two">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Where are you from?"
                            className="form-input-two"
                        />
                    </div>

                    <div className="form-group-two">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us a bit about yourself"
                            className="form-input-two"
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="form-group-two">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="form-input-two"
                            required
                        />
                        {errors.dateOfBirth && <p className="error-message-two">{errors.dateOfBirth}</p>}
                    </div>

                    <div className="form-group-two profile-picture-group">
                        <label>Profile Picture</label>
                        <input
                            type="file"
                            name="profilePicture"
                            accept="image/*"
                            onChange={handleFileChange}
                            id="profilePictureInput"
                            className="file-input-hidden"
                        />
                        <button
                            type="button"
                            onClick={handleButtonClick}
                            className="file-upload-button"
                        >
                            Choose Profile Picture
                        </button>
                        {imagePreview && (
                            <div className="image-preview-container">
                                <img
                                    src={imagePreview}
                                    alt="Profile Preview"
                                    className="image-preview"
                                />
                            </div>
                        )}
                        {errors.profilePicture && <p className="error-message-two">{errors.profilePicture}</p>}
                    </div>

                    <button type="submit" className="submit-button-two">
                        Complete Registration
                    </button>
                </form>

                <div className="login-redirect-two">
                    Already have an account? <Link to="/login" className="login-link-two">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default RegistrationStepTwo;