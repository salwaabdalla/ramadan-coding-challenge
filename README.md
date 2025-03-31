# Student Forum Platform

A collaborative platform for university students to interact, share knowledge, and help each other academically.

## Features

- User Authentication & Profiles
- Question & Answer System
- Upvotes & Engagement Features
- Real-time Notifications
- Search & Filtering
- Admin Panel (Future Enhancement)

## Tech Stack

- Frontend: React + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB
- Authentication: JWT
- Real-time: Socket.io
- File Upload: Cloudinary

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/student-forum
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

## Development

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:3000

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 