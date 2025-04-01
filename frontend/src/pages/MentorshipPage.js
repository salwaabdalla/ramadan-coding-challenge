import React from 'react';
import { Link } from 'react-router-dom';

const sampleMentors = [
  {
    name: "Abdi Hassan",
    skill: "Web Development",
    intro: "Full-stack developer with 5 years of experience, passionate about teaching coding to beginners.",
    location: "Mogadishu",
    email: "abdihassan.dev@gmail.com"
  },
  {
    name: "Amina Omar",
    skill: "Traditional Handicrafts",
    intro: "Artisan specializing in traditional Somali crafts. Teaching weaving and pottery techniques.",
    location: "Hargeisa",
    email: "amina.weaves@gmail.com"
  },
  {
    name: "Mohamed Ali",
    skill: "Sustainable Farming",
    intro: "Expert in drought-resistant farming methods and local crop optimization.",
    location: "Kismayo",
    email: "mohamed.ali.farm@gmail.com"
  },
];

const MentorshipPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Intro Section */}
      <section className="py-16 px-4 text-center bg-[#136269] text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Mentorship from Your Community
          </h1>
          <p className="text-xl md:text-2xl text-[#5DB2B3]">
            Skilled people from Somalia offering to share their knowledge
          </p>
        </div>
      </section>

      {/* Mentor Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleMentors.map((mentor, index) => (
            <Link
              key={index}
              to={`/mentor/${mentor.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#136269] mb-2">{mentor.name}</h3>
                <div className="inline-block bg-[#5DB2B3] text-white px-3 py-1 rounded-full text-sm mb-3">
                  {mentor.skill}
                </div>
                <p className="text-gray-600 mb-4">{mentor.intro}</p>
                <div className="flex items-center text-gray-500 mb-4">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {mentor.location}
                </div>
                <button className="w-full bg-[#136269] text-white py-2 rounded-lg hover:bg-[#5DB2B3] transition-colors duration-300">
                  View Profile
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MentorshipPage;
