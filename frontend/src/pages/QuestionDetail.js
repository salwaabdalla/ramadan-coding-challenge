import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  EyeIcon,
  FlagIcon,
  ShareIcon,
  BookmarkIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpIconSolid } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import socket from '../socket';
import AnswerForm from '../components/AnswerForm';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();

    // Listen for real-time updates
    socket.on('newAnswer', (answer) => {
      if (answer.questionId === id) {
        setAnswers(prev => [...prev, answer]);
      }
    });

    socket.on('answerUpdated', (updatedAnswer) => {
      if (updatedAnswer.questionId === id) {
        setAnswers(prev =>
          prev.map(answer =>
            answer._id === updatedAnswer._id ? updatedAnswer : answer
          )
        );
      }
    });

    socket.on('answerDeleted', (answerId) => {
      setAnswers(prev => prev.filter(answer => answer._id !== answerId));
    });

    return () => {
      socket.off('newAnswer');
      socket.off('answerUpdated');
      socket.off('answerDeleted');
    };
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/questions/${id}`);
      setQuestion(response.data);
      setEditContent(response.data.content);
      setError(null);
    } catch (err) {
      setError('Failed to fetch question. Please try again later.');
      console.error('Error fetching question:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/questions/${id}/answers`);
      setAnswers(response.data);
    } catch (err) {
      console.error('Error fetching answers:', err);
    }
  };

  const handleUpvote = async (type, id) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const endpoint = type === 'question' 
        ? `http://localhost:5000/api/questions/${id}/upvote`
        : `http://localhost:5000/api/answers/${id}/upvote`;
      
      const response = await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (type === 'question') {
        setQuestion(response.data);
      } else {
        setAnswers(prev =>
          prev.map(answer =>
            answer._id === id ? response.data : answer
          )
        );
      }
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/questions/${id}/answers`,
        { content: newAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnswers(prev => [...prev, response.data]);
      setNewAnswer('');
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  const handleEditQuestion = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/questions/${id}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuestion(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating question:', err);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteSuccess(true);
      navigate('/questions');
    } catch (err) {
      console.error('Error deleting question:', err);
    }
  };

  const handleAnswerPosted = (newAnswer) => {
    setAnswers(prev => [...prev, newAnswer]);
  };

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
      {/* Question */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {question.title}
              </h1>
              {isEditing ? (
                <div className="mb-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Edit your question..."
                  />
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={handleEditQuestion}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {question.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            <div className="ml-4 flex-shrink-0">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleUpvote('question', question._id)}
                  className={`p-2 rounded-full hover:bg-gray-100 ${
                    question.upvotes.includes(user?._id) ? 'text-primary-600' : 'text-gray-400'
                  }`}
                >
                  {question.upvotes.includes(user?._id) ? (
                    <HandThumbUpIconSolid className="h-6 w-6" />
                  ) : (
                    <HandThumbUpIcon className="h-6 w-6" />
                  )}
                </button>
                <span className="text-lg font-medium text-gray-900">
                  {question.upvotes.length}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="h-5 w-5 mr-1" />
                {new Date(question.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <EyeIcon className="h-5 w-5 mr-1" />
                {question.views} views
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user && user._id === question.author._id && (
                <>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    <PencilIcon className="h-5 w-5 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center text-sm text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5 mr-1" />
                    Delete
                  </button>
                </>
              )}
              <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                <FlagIcon className="h-5 w-5 mr-1" />
                Report
              </button>
              <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                <ShareIcon className="h-5 w-5 mr-1" />
                Share
              </button>
              <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                <BookmarkIcon className="h-5 w-5 mr-1" />
                Save
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center">
            {question.author.profilePicture ? (
              <img
                src={question.author.profilePicture}
                alt={question.author.name}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-500">
                  {question.author.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {question.author.name}
              </p>
              <p className="text-sm text-gray-500">
                {question.author.university} • {question.author.course} Year {question.author.year}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {answers.length} Answers
        </h2>

        {answers.map((answer) => (
          <div key={answer._id} className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="prose max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {answer.content}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleUpvote('answer', answer._id)}
                      className={`p-2 rounded-full hover:bg-gray-100 ${
                        answer.upvotes.includes(user?._id) ? 'text-primary-600' : 'text-gray-400'
                      }`}
                    >
                      {answer.upvotes.includes(user?._id) ? (
                        <HandThumbUpIconSolid className="h-6 w-6" />
                      ) : (
                        <HandThumbUpIcon className="h-6 w-6" />
                      )}
                    </button>
                    <span className="text-lg font-medium text-gray-900">
                      {answer.upvotes.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-5 w-5 mr-1" />
                    {new Date(answer.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {user && user._id === answer.author._id && (
                    <button className="inline-flex items-center text-sm text-red-500 hover:text-red-700">
                      <TrashIcon className="h-5 w-5 mr-1" />
                      Delete
                    </button>
                  )}
                  <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <FlagIcon className="h-5 w-5 mr-1" />
                    Report
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center">
                {answer.author.profilePicture ? (
                  <img
                    src={answer.author.profilePicture}
                    alt={answer.author.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-500">
                      {answer.author.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {answer.author.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {answer.author.university} • {answer.author.course} Year {answer.author.year}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Answer Form */}
        <div className="mt-8">
          <AnswerForm questionId={id} onAnswerPosted={handleAnswerPosted} />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Question
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this question? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuestion}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail; 