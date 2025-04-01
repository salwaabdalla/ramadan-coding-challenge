import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { mentors } from '../data/mentorsData';

const MentorProfile = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  
  // Find mentor by slug
  const mentor = mentors.find(m => m.slug === name);

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Mentor Not Found</h1>
            <p className="mt-4 text-gray-600">The mentor you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/mentorship')}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#136269] hover:bg-[#5DB2B3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#136269]"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Mentorship
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/mentorship')}
          className="mb-8 inline-flex items-center text-[#136269] hover:text-[#5DB2B3]"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Mentorship
        </button>

        {/* Mentor Profile Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-[#136269]">
            <div className="absolute -bottom-16 left-8">
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            </div>
          </div>

          <div className="pt-20 px-6 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{mentor.name}</h1>
            <div className="flex items-center text-gray-500 mb-6">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {mentor.location}
            </div>

            {/* Primary Skill */}
            <div className="mb-6">
              <span className="inline-block bg-[#5DB2B3] text-white px-3 py-1 rounded-full text-sm">
                {mentor.skill}
              </span>
            </div>

            {/* Bio Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{mentor.bio}</p>
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {mentor.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Testimonials</h2>
              <div className="space-y-4">
                {mentor.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 italic mb-2">"{testimonial.quote}"</p>
                    <p className="text-sm text-gray-500">- {testimonial.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Social Section */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div>
                  <a 
                    href={`mailto:${mentor.email}`}
                    className="text-[#136269] hover:text-[#5DB2B3] flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {mentor.email}
                  </a>
                </div>
                <div className="flex space-x-4">
                  <a
                    href={mentor.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#136269]"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a
                    href={mentor.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#136269]"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-.88-.06-1.573-1-1.573-1 0-1.16.777-1.16 1.526v5.651h-3v-11h3v1.751c.777-.358 1.594-.447 2.397-.447 2.566 0 3.1 1.683 3.1 3.856v6.84z"/>
                    </svg>
                  </a>
                  <a
                    href={mentor.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#136269]"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
