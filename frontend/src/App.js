import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AskQuestion from './pages/AskQuestion';
import QuestionDetail from './pages/QuestionDetail';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage'; 
import OpportunitiesPage from './pages/OpportunitiesPage';
import CreateOpportunity from './pages/CreateOpportunity';
import MentorshipPage from './pages/MentorshipPage';
import About from './pages/About';
import Contact from './pages/Contact';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/questions" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ask" element={<AskQuestion />} />
            <Route path="/question/:id" element={<QuestionDetail />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/mentorship" element={<MentorshipPage />} />
            <Route path="/create-opportunity" element={<CreateOpportunity />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

           

            <Route
              path="/profile/:id"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
