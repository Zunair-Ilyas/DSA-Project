import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

        // Validate form data
        if (!formData.gender) errors.gender = 'Gender is required';
        if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of Birth is required';
        if (!formData.profilePicture) errors.profilePicture = 'Profile picture is required';

        setErrors(errors);

        // If no errors, submit the form
        if (Object.keys(errors).length === 0) {
            try {
                // Prepare data to send to backend
                const data = {
                    userName: formData.userName,
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    bio: formData.bio,
                    location: formData.location,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    profilePicture: formData.profilePicture,  // Send file as is
                    friends: [],  // Empty array for now (you can update this later if needed)
                    friendRequestsSent: [],
                    friendRequestsReceived: [],
                    blockedUsers: [],
                    posts: [],
                };

                // Send data to the backend
                const response = await axios.post('http://localhost:2007/friends/register', data);

                if (response.status === 201) {
                    console.log('Registration successful:', response.data);
                    navigate('/home');  // Navigate to home page after successful registration
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
        <>
            <h1 className="Heading">Registration - Step 2</h1>
            <div className="RegistrationPage2">
                <img src={logo} className="RegistrationPageLogo" alt="Logo"/>
                <form className="RegistrationForm2" onSubmit={handleSubmit}>
                    <div className="FormFieldCustom">
                        <label htmlFor="gender">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="select"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        {errors.gender && <p className="Error">{errors.gender}</p>}
                    </div>
                    <div className="FormFieldCustom">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="FormFieldCustom">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="3"
                            cols="30"
                        ></textarea>
                    </div>
                    <div className="FormFieldCustom">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                        {errors.dateOfBirth && <p className="Error">{errors.dateOfBirth}</p>}
                    </div>
                    <div className="FormFieldCustom">
                        <label htmlFor="profilePicture" className="CustomFileButton" onClick={handleButtonClick}>
                            <span className="FormFieldCustomSpan">Choose Profile Picture</span>
                        </label>
                        <input
                            type="file"
                            name="profilePicture"
                            accept="image/*"
                            onChange={handleFileChange}
                            id="profilePictureInput"
                            style={{ display: 'none' }}
                        />
                        {imagePreview && <img src={imagePreview} alt="Profile Preview" className="ImagePreview" />}
                        {errors.profilePicture && <p className="Error">{errors.profilePicture}</p>}
                    </div>

                    <button type="submit" className="SubmitButton">
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
};

export default RegistrationStepTwo;
