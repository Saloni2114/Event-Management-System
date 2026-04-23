# Event Management System - MERN Stack

A full-stack MERN application for managing events with user registration and admin functionality.

## 🚀 Deployment on Render

This application is configured for single-deployment on Render, serving both frontend and backend from the same server.

### Prerequisites

- MongoDB database (MongoDB Atlas recommended for production)
- Render account

### Environment Variables

Create the following environment variables in your Render dashboard:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=10000 (or any port Render assigns)
```

### Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Render
2. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
3. **Environment**: Set the environment variables above
4. **Deploy**: Render will automatically build and deploy

### Local Development

```bash
# Install all dependencies
npm run install-all

# Start backend only (for API testing)
npm run dev:server

# Start frontend only (for UI development)
npm run dev:client

# Start full-stack locally
npm run dev
```

### Project Structure

```
├── client/          # React frontend
│   ├── src/
│   ├── dist/        # Built frontend (auto-generated)
│   └── package.json
├── ems-backend/     # Express backend
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── package.json
└── package.json     # Root package.json for deployment
```

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin only)
- `POST /api/events/:id/register` - Register for event

### Features

- User authentication with JWT
- Role-based access control (admin/user)
- Event creation and management
- User registration for events
- Responsive React frontend
- MongoDB database with Mongoose ODM