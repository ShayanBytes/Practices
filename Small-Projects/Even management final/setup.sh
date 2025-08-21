#!/bin/bash

echo "🎉 Event Management System Setup Script"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

echo ""
echo "🔧 Setting up Backend..."
echo "------------------------"

# Install backend dependencies
cd backend
echo "📦 Installing backend dependencies..."
npm install

echo "🔧 Setting up environment file..."
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
MONGODB_URI=mongodb://localhost:27017/eventmanagement
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
EOL
    echo "✅ Created .env file (please update with your settings)"
else
    echo "⚠️ .env file already exists"
fi

cd ..

echo ""
echo "🎨 Setting up Frontend..."
echo "-------------------------"

# Install frontend dependencies
cd frontend
echo "📦 Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📝 Next steps:"
echo "1. Make sure MongoDB is running on your system"
echo "2. Update backend/.env with your MongoDB URI and JWT secret"
echo "3. Start the backend server:"
echo "   cd backend && npm run dev"
echo "4. In a new terminal, start the frontend:"
echo "   cd frontend && npm start"
echo ""
echo "🌐 The app will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Happy coding! 🚀"
