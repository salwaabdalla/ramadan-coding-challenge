import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Login from '../pages/Login';
import {
  XMarkIcon,
  CheckIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const AskQuestion = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    category: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'academic', name: 'Academic', icon: AcademicCapIcon },
    { id: 'career', name: 'Career', icon: BriefcaseIcon },
    { id: 'social', name: 'Social', icon: UserGroupIcon },
    { id: 'other', name: 'Other', icon: ChatBubbleLeftIcon }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const response = await axios.post(
        'http://localhost:5000/api/questions',
        {
          ...formData,
          tags: tagsArray
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate(`/question/${response.data._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // If user is not logged in, show message and login component
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-[#5DB2B3]">
          <div className="px-6 py-5 border-b border-gray-200 bg-[#136269]">
            <h1 className="text-2xl font-bold text-white">Ask a Question</h1>
          </div>
          
          <div className="px-6 py-6">
            <div className="bg-[#136269]/10 border border-[#136269] rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-[#136269]">
                <span role="img" aria-label="info">💡</span>
                <span>You must be logged in to ask a question.</span>
              </div>
            </div>
            
            <Login />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-[#5DB2B3]">
        <div className="px-6 py-5 border-b border-gray-200 bg-[#136269]">
          <h1 className="text-2xl font-bold text-white">Ask a Question</h1>
          <p className="mt-1 text-sm text-[#D1FAE5]">
            Contribute to the KAAB HUB community by asking a clear and helpful question.
          </p>
        </div>

        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <XMarkIcon className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
                  <p className="text-sm text-green-700">Question posted successfully! Redirecting...</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#5DB2B3] focus:border-[#5DB2B3] sm:text-sm"
                placeholder="Be specific and concise"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map(({ id, name, icon: Icon }) => (
                  <label 
                    key={id} 
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200
                      ${formData.category === id 
                        ? 'border-[#136269] bg-[#136269]/5 shadow-sm' 
                        : 'border-gray-300 hover:border-[#5DB2B3] hover:bg-gray-50'
                      }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={id}
                      checked={formData.category === id}
                      onChange={handleChange}
                      className="hidden peer"
                      required
                    />
                    <Icon className={`w-5 h-5 mr-3 ${formData.category === id ? 'text-[#136269]' : 'text-gray-400'}`} />
                    <span className={`text-sm ${formData.category === id ? 'text-[#136269] font-medium' : 'text-gray-700'}`}>
                      {name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Details</label>
              <textarea
                id="content"
                name="content"
                rows={6}
                value={formData.content}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#5DB2B3] focus:border-[#5DB2B3] sm:text-sm"
                placeholder="Provide context, examples, or relevant background..."
                required
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text"
                name="tags"
                id="tags"
                value={formData.tags}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#5DB2B3] focus:border-[#5DB2B3] sm:text-sm"
                placeholder="e.g., python, networking, career"
              />
              <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="mr-3 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#136269] hover:bg-[#5DB2B3] text-white text-sm font-semibold rounded-md disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post Question'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;