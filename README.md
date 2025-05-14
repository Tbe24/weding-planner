# Wedding Planning Platform

## Environment Setup

This project uses environment variables for configuration. Create an `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_DOMAIN=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5173
```

For production deployment, create a `.env.production` file:

```env
# API Configuration
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_API_DOMAIN=https://your-backend-url.com
VITE_FRONTEND_URL=https://weddingplanning-1-joi4.onrender.com
```

## Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd back-end
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `back-end` directory with the following content:

   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/weddingplanning"
   JWT_SECRET="your-jwt-secret"
   PORT=5000
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Seed the database with sample data:

   ```bash
   npm run seed
   ```

   This will create:

   - An admin user (`admin@example.com` / password123)
   - A vendor user (`vendor@example.com` / password123)
   - 24 services across 6 service types and 4 categories (Bronze, Silver, Gold, Platinum)
   - Each service includes detailed descriptions, features, pricing, and timeline information

6. Start the backend server:

   ```bash
   npm run server
   ```

   The server will automatically create the following directories if they don't exist:

   - `uploads/` - For storing uploaded files
   - `uploads/categories/` - For storing category images

## Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
