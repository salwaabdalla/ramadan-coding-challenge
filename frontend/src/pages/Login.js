import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const user = await login(formData.email, formData.password);
      const from = location.state?.from || '/questions';
      navigate(from);
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        setErrors(prev => ({
          ...prev,
          submit: error.response.data.message
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          submit: 'Login failed. Please check your credentials and try again.'
        }));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#136269]/5 to-[#5DB2B3]/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#136269]">Welcome Back to KAAB HUB</h2>
          <p className="mt-2 text-sm text-gray-600">Connect with your learning community</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5DB2B3] focus:border-[#5DB2B3] sm:text-sm ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5DB2B3] focus:border-[#5DB2B3] sm:text-sm ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>

          {authError && (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{authError}</p>
            </div>
          )}

          {errors.submit && (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{errors.submit}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#136269] hover:bg-[#136269]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5DB2B3] transition-colors duration-200"
            >
              Log In
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-[#136269] hover:text-[#5DB2B3] transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
