import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  BellIcon,
  ChatAlt2Icon,
  ThumbUpIcon,
  AtSymbolIcon,
  CheckCircleIcon,
  FilterIcon,
  SortAscendingIcon
} from '@heroicons/react/outline';

const Notifications = () => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(
        'http://localhost:5000/api/notifications/read-all',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'answer':
        return <ChatAlt2Icon className="h-5 w-5 text-blue-500" />;
      case 'upvote':
        return <ThumbUpIcon className="h-5 w-5 text-green-500" />;
      case 'mention':
        return <AtSymbolIcon className="h-5 w-5 text-purple-500" />;
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case 'answer':
        return `/question/${notification.questionId}`;
      case 'upvote':
        return notification.questionId
          ? `/question/${notification.questionId}`
          : `/answer/${notification.answerId}`;
      case 'mention':
        return `/question/${notification.questionId}`;
      case 'accepted':
        return `/question/${notification.questionId}`;
      default:
        return '#';
    }
  };

  const filteredNotifications = notifications
    .filter(notification => {
      if (filter === 'all') return true;
      if (filter === 'unread') return !notification.read;
      return notification.type === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center text-gray-500 hover:text-gray-700"
            >
              <FilterIcon className="h-5 w-5 mr-1" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filter === 'all'
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filter === 'unread'
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Unread
                  </button>
                  <button
                    onClick={() => setFilter('answer')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filter === 'answer'
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Answers
                  </button>
                  <button
                    onClick={() => setFilter('upvote')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filter === 'upvote'
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Upvotes
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSortBy('newest')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      sortBy === 'newest'
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Newest first
                  </button>
                  <button
                    onClick={() => setSortBy('oldest')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      sortBy === 'oldest'
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Oldest first
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No notifications found
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <Link
                key={notification._id}
                to={getNotificationLink(notification)}
                onClick={() => markAsRead(notification._id)}
                className={`block p-4 hover:bg-gray-50 ${
                  !notification.read ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="ml-4 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        New
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications; 