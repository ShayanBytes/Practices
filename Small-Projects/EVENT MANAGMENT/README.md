# Event Management System

A full-stack event management application with React.js frontend and Node.js backend.

## Project Structure

```
EVENT MANAGMENT/
├── frontend/           # React.js frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── backend/            # Node.js/Express backend API
│   ├── routes/
│   ├── middleware/
│   ├── data/
│   ├── package.json
│   └── server.js
└── README.md
```

## Features

- **Authentication**: User registration and login with JWT
- **Role-based Access**: Organizer and Attendee roles
- **Event Management**: Create, view, and manage events
- **Event Registration**: Attendees can register for events
- **Dashboard**: Role-specific dashboards with different features

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "EVENT MANAGMENT"
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   npm start
   ```

   Backend will run on http://localhost:5000

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run on http://localhost:3000

### Development Commands

**Backend (from backend/ directory):**

- `npm start` - Start the backend server
- `npm run dev` - Start backend in development mode (if nodemon is configured)

**Frontend (from frontend/ directory):**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Events

- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (Organizer only)
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event (Organizer only)
- `DELETE /api/events/:id` - Delete event (Organizer only)
- `POST /api/events/:id/register` - Register for event (Attendee)
- `DELETE /api/events/:id/register` - Cancel registration (Attendee)
- `GET /api/events/:id/registrations` - Get event registrations (Organizer)

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Technologies Used

### Frontend

- React.js 18
- Vite
- Tailwind CSS
- React Router DOM

### Backend

- Node.js
- Express.js
- JWT for authentication
- File-based data storage (JSON files)
- CORS enabled

## Development Notes

- Frontend runs on port 3000
- Backend runs on port 5000
- API proxy is configured in Vite for development
- All API calls go through `/api` prefix
- JWT tokens are stored in localStorage

## License

This project is for educational purposes.
