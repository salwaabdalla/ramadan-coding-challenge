import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  UserCircleIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  PencilIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftIcon,
  HandThumbUpIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, token } = useAuth(); // ✅ token now properly declared
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    questionsCount: 0,
    answersCount: 0,
    upvotesReceived: 0
  });

  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { from: `/profile/${id}` } });
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/profile/${id || currentUser?._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(response.data);
        setStats({
          questionsCount: response.data.questionsAsked?.length || 0,
          answersCount: response.data.answersProvided?.length || 0,
          upvotesReceived: response.data.upvotesReceived || 0
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
        if (err.response?.status === 401) {
          navigate('/login', { state: { from: `/profile/${id}` } });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, token, currentUser, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center space-x-5">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-20 w-20 text-gray-300" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                  {isOwnProfile && (
                    <Link
                      to="/settings"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  )}
                </div>
                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <AcademicCapIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {user?.university}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <BookOpenIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {user?.course}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    Year {user?.year}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
          <StatCard icon={<QuestionMarkCircleIcon className="h-6 w-6 text-primary-600" />} label="Questions Asked" value={stats.questionsCount} />
          <StatCard icon={<ChatBubbleLeftIcon className="h-6 w-6 text-primary-600" />} label="Answers Provided" value={stats.answersCount} />
          <StatCard icon={<HandThumbUpIcon className="h-6 w-6 text-primary-600" />} label="Upvotes Received" value={stats.upvotesReceived} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
            {user?.questionsAsked?.length > 0 ? (
              <div className="space-y-4">
                {user.questionsAsked.slice(0, 5).map((question) => (
                  <div key={question._id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <Link
                      to={`/question/${question._id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {question.title}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(question.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">{icon}</div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
            <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

export default Profile;
