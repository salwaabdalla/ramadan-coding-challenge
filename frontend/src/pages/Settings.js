import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  UserCircleIcon,
  BellIcon,
  LockClosedIcon,
  KeyIcon,
  TrashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const navigate = useNavigate();
  const { user, token, logout, updateProfile, uploadProfilePicture } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    field: user?.field || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notificationPreferences: {
      emailNotifications: true,
      pushNotifications: true,
      answerNotifications: true,
      upvoteNotifications: true,
      mentionNotifications: true
    },
    privacySettings: {
      showEmail: false,
      showUniversity: true,
      showCourse: true,
      showYear: true
    }
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
        setFormData(prev => ({
          ...prev,
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || '',
          location: userData.location || '',
          field: userData.field || '',
          notificationPreferences: userData.notificationPreferences || prev.notificationPreferences,
          privacySettings: userData.privacySettings || prev.privacySettings
        }));
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
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const [category, setting] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
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
        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
        
        await uploadProfilePicture(file);
        setSuccess('Profile picture updated successfully');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to upload profile picture');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        field: formData.field
      });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.put(
        'http://localhost:5000/api/users/change-password',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Password updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.put(
        'http://localhost:5000/api/users/notification-preferences',
        formData.notificationPreferences,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Notification preferences updated successfully');
    } catch (err) {
      setError('Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.put(
        'http://localhost:5000/api/users/privacy-settings',
        formData.privacySettings,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Privacy settings updated successfully');
    } catch (err) {
      setError('Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.delete('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      logout();
      navigate('/');
    } catch (err) {
      setError('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <UserCircleIcon className="h-5 w-5 mr-1" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`${
                activeTab === 'account'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <KeyIcon className="h-5 w-5 mr-1" />
              Account
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <BellIcon className="h-5 w-5 mr-1" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`${
                activeTab === 'privacy'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <LockClosedIcon className="h-5 w-5 mr-1" />
              Privacy
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-8">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover border-4 border-primary-500"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-primary-500 flex items-center justify-center border-4 border-primary-500">
                        <span className="text-2xl font-bold text-white">
                          {formData.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <label
                      htmlFor="profile-picture"
                      className="absolute bottom-0 right-0 bg-primary-500 rounded-full p-2 cursor-pointer hover:bg-primary-600 transition-colors duration-200"
                    >
                      <PhotoIcon className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        id="profile-picture"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="field" className="block text-sm font-medium text-gray-700">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    id="field"
                    name="field"
                    value={formData.field}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon className="h-5 w-5 mr-1" />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notificationPreferences.emailNotifications"
                      checked={formData.notificationPreferences.emailNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Push Notifications</label>
                    <p className="text-sm text-gray-500">Receive notifications in browser</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notificationPreferences.pushNotifications"
                      checked={formData.notificationPreferences.pushNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Answer Notifications</label>
                    <p className="text-sm text-gray-500">Get notified when someone answers your question</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notificationPreferences.answerNotifications"
                      checked={formData.notificationPreferences.answerNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Upvote Notifications</label>
                    <p className="text-sm text-gray-500">Get notified when someone upvotes your content</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notificationPreferences.upvoteNotifications"
                      checked={formData.notificationPreferences.upvoteNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Mention Notifications</label>
                    <p className="text-sm text-gray-500">Get notified when someone mentions you</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notificationPreferences.mentionNotifications"
                      checked={formData.notificationPreferences.mentionNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleNotificationUpdate}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Show Email</label>
                    <p className="text-sm text-gray-500">Make your email visible to other users</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="privacySettings.showEmail"
                      checked={formData.privacySettings.showEmail}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Show University</label>
                    <p className="text-sm text-gray-500">Display your university on your profile</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="privacySettings.showUniversity"
                      checked={formData.privacySettings.showUniversity}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Show Course</label>
                    <p className="text-sm text-gray-500">Display your course on your profile</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="privacySettings.showCourse"
                      checked={formData.privacySettings.showCourse}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Show Year</label>
                    <p className="text-sm text-gray-500">Display your year of study on your profile</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="privacySettings.showYear"
                      checked={formData.privacySettings.showYear}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handlePrivacyUpdate}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Account
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAccountDelete}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 