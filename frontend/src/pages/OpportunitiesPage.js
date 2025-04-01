import React, { useState } from 'react';

const realOpportunities = [
  {
    id: 1,
    title: "YAGA Youth Summit 2025",
    host: "Shaqodoon Organization",
    deadline: "2025-04-06",
    location: "Mogadishu",
    category: "Event",
    field: "Youth Empowerment",
    description: "Annual youth summit focused on innovation, digital skills, and entrepreneurship in Somalia.",
    link: "https://www.facebook.com/shaqodoonorganization"
  },
  {
    id: 2,
    title: "Coding for Kids Bootcamp",
    host: "Innovate Hub",
    deadline: "2025-04-10",
    location: "Hargeisa",
    category: "Workshop",
    field: "IT",
    description: "A 2-week beginner bootcamp introducing kids to basic programming and digital literacy.",
    link: "https://www.facebook.com/innovatehubhargeisa"
  },
  {
    id: 3,
    title: "Somali Women in Tech Networking Meetup",
    host: "Somali Women in Technology",
    deadline: "2025-04-15",
    location: "Mogadishu",
    category: "Event",
    field: "Technology",
    description: "Networking and mentorship event for women in STEM careers across Somalia.",
    link: "https://www.facebook.com/somtechwomen"
  },
  {
    id: 4,
    title: "UNDP Youth Innovation Challenge",
    host: "UNDP Somalia",
    deadline: "2025-04-20",
    location: "Online / Somalia",
    category: "Competition",
    field: "Innovation",
    description: "Submit your ideas that solve community problems using technology or entrepreneurship.",
    link: "https://www.so.undp.org/"
  },
  {
    id: 5,
    title: "Japanese Government (MEXT) Research Scholarship",
    host: "Embassy of Japan in Somalia",
    deadline: "2025-05-03",
    location: "Japan",
    category: "Scholarship",
    field: "Various",
    description: "Scholarship for Somali students interested in pursuing master's or doctoral courses at Japanese universities.",
    link: "https://www.ke.emb-japan.go.jp/jointad/so/itpr_en/scholarships.html"
  },
  {
    id: 6,
    title: "Chevening Scholarships for Somali Students",
    host: "UK Government",
    deadline: "2025-11-02",
    location: "United Kingdom",
    category: "Scholarship",
    field: "Various",
    description: "Fully funded master's degree scholarships for future leaders from Somalia to study in the UK.",
    link: "https://www.chevening.org/scholarship/somalia/"
  },
  {
    id: 7,
    title: "World Bank Graduate Scholarship Program",
    host: "World Bank",
    deadline: "2025-05-31",
    location: "Various Countries",
    category: "Scholarship",
    field: "Development Studies",
    description: "Scholarships for Somali students to pursue master's degrees in development-related fields.",
    link: "https://www.worldbank.org/en/programs/scholarships"
  },
  {
    id: 8,
    title: "Italian Government Scholarships for Somali Students",
    host: "Embassy of Italy in Mogadishu",
    deadline: "2025-06-15",
    location: "Italy",
    category: "Scholarship",
    field: "Various",
    description: "Scholarships for Somali students to study in Italian universities across various disciplines.",
    link: "https://ambmogadiscio.esteri.it/en/news/dall_ambasciata/"
  },
  {
    id: 9,
    title: "U.S. Exchange Programs for Somali Citizens",
    host: "U.S. Department of State",
    deadline: "Varies",
    location: "United States",
    category: "Exchange Program",
    field: "Various",
    description: "Educational and cultural exchange programs for Somali citizens to study or train in the United States.",
    link: "https://so.usembassy.gov/education/"
  }
];

const OpportunitiesPage = () => {
  const [filters, setFilters] = useState({ category: '', location: '', field: '' });

  const filteredOpportunities = realOpportunities.filter((opportunity) => {
    const matchCategory = !filters.category || opportunity.category === filters.category;
    const matchLocation = !filters.location || opportunity.location === filters.location;
    const matchField = !filters.field || opportunity.field === filters.field;
    return matchCategory && matchLocation && matchField;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#136269] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Grow Through Opportunity</h1>
          <p className="text-xl text-gray-100">Find real scholarships, workshops, and events in Somalia.</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5DB2B3]"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Workshop">Workshop</option>
            <option value="Event">Event</option>
            <option value="Internship">Internship</option>
            <option value="Competition">Competition</option>
            <option value="Exchange Program">Exchange Program</option>
          </select>

          <select
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5DB2B3]"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          >
            <option value="">All Locations</option>
            <option value="Mogadishu">Mogadishu</option>
            <option value="Hargeisa">Hargeisa</option>
            <option value="Baidoa">Baidoa</option>
            <option value="Online / Somalia">Online / Somalia</option>
            <option value="Japan">Japan</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
            <option value="Italy">Italy</option>
            <option value="Various Countries">Various Countries</option>
          </select>

          <select
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5DB2B3]"
            value={filters.field}
            onChange={(e) => setFilters({ ...filters, field: e.target.value })}
          >
            <option value="">All Fields</option>
            <option value="IT">IT</option>
            <option value="Business">Business</option>
            <option value="Engineering">Engineering</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Youth Empowerment">Youth Empowerment</option>
            <option value="Innovation">Innovation</option>
            <option value="Technology">Technology</option>
            <option value="Development Studies">Development Studies</option>
            <option value="Various">Various</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredOpportunities.length === 0 ? (
          <p className="text-center text-gray-500">No opportunities match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-[#5DB2B3] text-white text-sm rounded-full">
                      {opportunity.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#136269] mb-2">
                    {opportunity.title}
                  </h3>
                  <p className="text-gray-600 mb-2">🏫 {opportunity.host}</p>
                  <p className="text-gray-600 mb-2">🌍 {opportunity.location}</p>
                  <p className="text-gray-700 mb-4 line-clamp-2">{opportunity.description}</p>
                  <a
                    href={opportunity.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-[#136269] text-white text-center py-2 px-4 rounded-md hover:bg-[#5DB2B3] transition-colors duration-300"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesPage;
