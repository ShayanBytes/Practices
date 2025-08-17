# Event Management System

A full-stack event management application built with React.js, Node.js, Express.js, and MongoDB. This system allows users to organize events or register as attendees with role-based authentication and comprehensive event management features.

## 🚀 Features

### For Organizers

- **Profile Management**: Organization name, contact info, event types
- **Event CRUD Operations**: Create, read, update, delete events
- **Registration Management**: View and manage event registrations
- **Attendee Lists**: Access to registered attendee information
- **Event Analytics**: Track registration numbers and capacity

### For Attendees

- **Profile Management**: Name, interests, location
- **Event Discovery**: Browse and filter available events
- **Event Registration**: Register/unregister for events
- **Personal Dashboard**: View registered events and status

### General Features

- **JWT Authentication**: Secure user authentication
- **Role-Based Access Control**: Organizer vs Attendee permissions
- **Responsive Design**: Mobile-friendly Tailwind CSS interface
- **Real-time Updates**: Live event capacity and registration status
- **Search & Filter**: Find events by type, location, date
- **Conditional Rendering**: UI adapts based on user role

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose
- **API**: RESTful API architecture

## 📁 Project Structure

```
event-management-system/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Individual page components
│   │   │   ├── organizer/  # Organizer-specific pages
│   │   │   └── attendee/   # Attendee-specific pages
│   │   ├── context/        # React Context (Auth)
│   │   ├── services/       # API service functions
│   │   └── ...
│   └── package.json
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB/Mongoose models
│   ├── routes/             # Express route handlers
│   ├── middleware/         # Authentication middleware
│   ├── server.js           # Express server setup
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/eventmanagement
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Start the backend server**

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

### Database Setup

The application will automatically create the necessary collections when you start using it. No manual database setup required.

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Events

- `GET /api/events` - Get all public events (with filtering)
- `GET /api/events/:id` - Get specific event details
- `POST /api/events` - Create new event (organizer only)
- `PUT /api/events/:id` - Update event (organizer only)
- `DELETE /api/events/:id` - Delete event (organizer only)
- `POST /api/events/:id/register` - Register for event (attendee only)
- `POST /api/events/:id/unregister` - Unregister from event (attendee only)
- `GET /api/events/organizer/my-events` - Get organizer's events
- `GET /api/events/:id/registrations` - Get event registrations (organizer only)

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/registered-events` - Get attendee's registered events

## 🎯 Usage Examples

### Demo Accounts

For testing purposes, you can create demo accounts:

**Organizer Account:**

- Email: organizer@demo.com
- Password: password123

**Attendee Account:**

- Email: attendee@demo.com
- Password: password123

### Creating an Event (Organizer)

1. Login as an organizer
2. Navigate to "Create Event"
3. Fill in event details (title, description, date, location, etc.)
4. Set maximum attendees
5. Save the event

### Registering for an Event (Attendee)

1. Login as an attendee
2. Browse events on the Events page
3. Click "Register" on desired events
4. View registered events in "My Registrations"

## 🔐 Authentication & Authorization

The system uses JWT (JSON Web Tokens) for authentication:

- **Registration**: Users choose their role (organizer/attendee) during signup
- **Login**: Returns JWT token stored in localStorage
- **Protected Routes**: Middleware validates JWT tokens
- **Role-Based Access**: Different permissions for organizers vs attendees

## 🎨 Key Learning Objectives

This project demonstrates:

1. **Full-Stack Development**: Integration of React frontend with Node.js backend
2. **Database Design**: MongoDB schema design for users and events
3. **Authentication Systems**: JWT implementation with role-based access
4. **CRUD Operations**: Complete Create, Read, Update, Delete functionality
5. **State Management**: React Context for global state
6. **Responsive Design**: Mobile-first approach with Tailwind CSS
7. **API Design**: RESTful API principles and best practices
8. **Error Handling**: Comprehensive error handling on both frontend and backend

## 🚧 Future Enhancements

- **Email Notifications**: Send confirmation emails for registrations
- **Payment Integration**: Paid events with Stripe integration
- **Event Categories**: Advanced categorization and tagging
- **Calendar Integration**: Export events to calendar apps
- **Social Features**: Event sharing and social media integration
- **Admin Dashboard**: System administration and analytics
- **Real-time Chat**: Event-specific chat rooms
- **Mobile App**: React Native mobile application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you have any questions or need help with setup, please:

1. Check the issues section for common problems
2. Create a new issue with detailed description
3. Contact the development team

---

**Happy Event Managing! 🎉**
