# Installation

This guide will walk you through setting up FlickDo on your local machine for development or self-hosting.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** ([Download](https://git-scm.com/))
- **Supabase account** (free tier works fine) ([Sign up](https://supabase.com/))

## Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rub3nnn/FlickDo.git
cd FlickDo
```

### 2. Database Setup

#### Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Wait for the database to provision

#### Run Database Migrations

```bash
# Use the SQL editor in Supabase Dashboard
# Copy and paste the contents of database/fulldatabase.sql
# Execute the SQL script
```

Alternatively, if you have Supabase CLI:

```bash
supabase db push --db-url your-database-url < database/fulldatabase.sql
```

### 3. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Server Configuration
PORT=3000
NODE_ENV=development

# Google Classroom API (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
```

Start the backend server:

```bash
npm start
```

The server should now be running at `http://localhost:3000`

### 4. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Start the development server:

```bash
npm run dev
```

The app should now be running at `http://localhost:5173`

## Verification

1. Open your browser to `http://localhost:5173`
2. You should see the FlickDo login page
3. Try signing up with an email or Google account
4. Create your first task!

## Common Issues

### Port Already in Use

If port 3000 or 5173 is already in use:

```bash
# Backend
PORT=3001 npm start

# Frontend - update VITE_API_URL in .env
VITE_API_URL=http://localhost:3001
```

### Database Connection Errors

- Verify your Supabase credentials in `.env`
- Check that the database migrations ran successfully
- Ensure your IP is allowed in Supabase settings

### Google OAuth Not Working

- Verify redirect URIs in Google Cloud Console
- Check that credentials match in both `.env` files
- Ensure you're using `http://localhost` (not `127.0.0.1`)

## Next Steps

- **[Quick Start Guide](quick-start.md)** - Learn the basics
- **[Development Guide](../development/architecture.md)** - Understand the codebase
- **[Deployment Guide](../deployment/environment.md)** - Deploy to production

---

!!! tip "Development Mode"
Both frontend and backend support hot-reload, so changes will reflect immediately during development.

!!! warning "Production Deployment"
This setup is for development only. See the [Deployment](../deployment/environment.md) section for production configuration.
