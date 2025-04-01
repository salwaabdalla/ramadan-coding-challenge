import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Icons
import {
  UserCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const navigate = useNavigate();
  const { user, token, logout, updateProfile, uploadProfilePicture } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Updated form fields to match backend: name, bio, university, course, year
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    university: user?.university || '',
    course: user?.course || '',
    year: user?.year || ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { from: '/settings' } });
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = response.data;
        setFormData({
          name: userData.name || '',
          bio: userData.bio || '',
          university: userData.university || '',
          course: userData.course || '',
          year: userData.year || ''
        });
        setPreviewUrl(userData.profilePicture);
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login', { state: { from: '/settings' } });
        } else {
          setError(err.response?.data?.message || 'Failed to fetch user data');
        }
      }
    };

    fetchUserData();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, or GIF)');
      return;
    }

    try {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);

      await uploadProfilePicture(file);
      setSuccess('Profile picture updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 mr-2" /> {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" /> {success}
        </div>
      )}

      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div className="flex items-center space-x-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover border"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <span className="text-sm text-blue-600 hover:underline">Change Photo</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            rows="3"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">University</label>
          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Course</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Year</label>
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Settings;
