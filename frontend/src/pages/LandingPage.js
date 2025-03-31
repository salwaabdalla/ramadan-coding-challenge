import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-[#136269] min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[#5DB2B3] transform -skew-y-6"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <img
              src="/logo.jpg"
              alt="KAAB HUB Logo"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg"
            />
          </div>

          {/* Main Slogan */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Where Curiosity Meets Community
          </h1>
          <p className="text-lg sm:text-xl text-[#5DB2B3] max-w-2xl mx-auto mb-8">
            Whether you're a student with questions or a mentor with wisdom to share — this is your space to grow and give back.
          </p>

          {/* Single CTA Button */}
          <div className="flex justify-center">
            <Link
              to="/register"
              className="bg-[#5DB2B3] hover:bg-[#4a9596] text-white font-semibold py-3 px-8 rounded-lg text-lg transition transform hover:scale-105"
            >
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#136269] mb-12">
            Why Join KAAB HUB?
          </h2>

          <div className="grid gap-10 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-[#136269] text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Ask & Answer</h3>
              <p className="text-gray-600">
                Share your knowledge or seek help from fellow students across Somalia.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-[#136269] text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-2">Mentor & Uplift</h3>
              <p className="text-gray-600">
                Skilled locals can offer guidance, share skills, or post scholarships and events.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-[#136269] text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Community First</h3>
              <p className="text-gray-600">
                We believe education is a shared journey - powered by people who care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#136269] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">KAAB HUB</p>
          <p className="text-sm mb-4 text-[#5DB2B3]">
            Empowering Somali learners through community, mentorship, and technology.
          </p>
          <p className="text-sm text-white/60">&copy; {new Date().getFullYear()} KAAB HUB. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
