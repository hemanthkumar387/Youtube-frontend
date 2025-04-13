#!/bin/bash

: '
📺 YouTube Clone - Full Stack Video Streaming App

This is a full-stack YouTube-style video sharing application.
The frontend is developed with React, while the backend uses Node.js, Express, and MongoDB.

🚀 Features
✅ Upload Videos
✅ Watch Videos
✅ Channel Page
✅ Add/Delete Videos
✅ Modal-based Upload Form
✅ Responsive UI

🛠️ Tech Stack

🖥️ Frontend
- React.js
- React Router DOM
- CSS
- Context API
- useEffect/useState Hooks
- Vite

🔧 Backend
- Node.js
- Express.js
- MongoDB Atlas
- cors

📁 Project Structure

📦 YouTube_Clone
├── 📂 client
│   ├── 📂 components
│   │   ├── Category, CommentSection, CreateChannel, Login, Main, Navbar, Register, Sidebar, VideoItem, VideoModel, ViewChannel
│   ├── 📂 utils
│   │   ├── useVideos.js
│   │   ├── formatTimeAgo.js
│   │   ├── videoDuration.js
│   ├── App.jsx, main.jsx
│   ├── index.css, index.html
│   ├── vite.config.js
│   └── package.json
├── 📂 server
│   ├── 📂 middleware
│   │   ├── verifyToken
│   ├── 📂 routes
│   │   ├── videosRoutes, channelRoutes, commentsRoutes, authRoutes, usersRoutes
│   ├── 📂 models
│   │   ├── VideoModel, ChannelModel, CommentModel, UserModel
│   ├── 📂 controllers
│   │   ├── videoController, authController, channelController, commentController, userController
│   ├── server.js
│   └── package.json

🌐 API Routes

Video Routes:
- POST /api/videos → Upload a video
- GET /api/videos → Get all videos
- DELETE /api/videos/:id → Delete a video by ID

auth Routes:
- POST /api/auth/register → Register a user
- POST /api/auth/login → Login a user

📦 Installation & Running the Project

1️⃣ Clone the repository
git clone <your-repo-url>
cd YouTube_Clone

2️⃣ Setup Frontend
cd frontend
npm install
npm run dev
# Visit: http://localhost:5173

3️⃣ Setup Backend
cd ..backend
npm install
npx nodemon server.js
# Backend runs on: http://localhost:5000

🧪 API Testing
Use Postman or ThunderClient (VSCode) to test the video API routes.

📌 Notes
- MongoDB connection must be configured in the file.
- Make sure both frontend and backend are running simultaneously.
- Uses a modal form to upload videos including thumbnail and video.

'
