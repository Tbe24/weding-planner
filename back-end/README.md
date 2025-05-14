# Wedding Planning Platform - Backend

This is the backend service for the Wedding Planning Platform.

## Setup Instructions

### Prerequisites
- Node.js (v18.18 or higher)
- MySQL database
- npm or yarn

### Environment Setup
1. Copy the `.env.example` file to a new file named `.env`:
   ```
   cp .env.example .env
   ```

2. Update the `.env` file with your database credentials and other configuration:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/weddingplanner"
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   PORT=5000
   NODE_ENV=development
   ```

### Installation
1. Install dependencies:
   ```
   npm install
   ```

2. Set up the database with migrations and seed data:
   ```
   npm run db:setup
   ```
   
   This command will:
   - Run the Prisma migrations to create the database schema
   - Seed the database with initial data including:
     - Admin user (email: admin@weddingplanner.com, password: Admin@123)
     - Default service categories

### Running the Server
1. Start the development server:
   ```
   npm run server
   ```

2. The server will be available at http://localhost:5000

## API Documentation

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Admin Routes
- GET/POST `/api/admin/service-categories` - Manage service categories
- GET/POST/PATCH/DELETE `/api/admin/service-categories/:id` - Manage specific category

### Client Routes
- GET `/api/client/service-categories` - Get all service categories
- GET `/api/client/service-categories/:id` - Get category with its services

### Vendor Routes
- GET/POST/PATCH/DELETE `/api/vendor/services` - Manage vendor services

## Database Schema

The database includes the following main models:
- User (Admin, Client, Vendor, Event Planner)
- ServiceCategory
- Service
- Booking
- Payment
- Feedback

## Default Admin Credentials
- Email: admin@weddingplanner.com
- Password: Admin@123
