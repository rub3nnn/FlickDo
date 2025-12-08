# FlickDo

<div align="center">

![FlickDo Logo](/docs/imgs/logo.png)

**A modern basic task management application**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)

[Features](#-features) •
[Technologies](#-technologies) •
[Installation](#-installation) •
[Usage](#-usage) •
[API](#-api) •
[Contributing](#-contributing)

</div>

---

## 📋 Description

FlickDo is a complete web task management application designed for students and professionals. It offers an intuitive interface for organizing tasks, custom lists, Google Classroom integration, productivity statistics, and more.

### ✨ Features

- 📝 **Task Management**: Create, edit, complete, and delete tasks with ease
- 📁 **Custom Lists**: Organize your tasks into lists and projects
- 🎓 **Google Classroom Integration**: Automatically sync tasks from your classes
- 🏷️ **Tags**: Categorize and filter tasks with custom tags
- 📊 **Statistics**: Visualize your productivity with charts and metrics
- 🌓 **Dark/Light Mode**: Interface adaptable to your preferences
- 🌐 **Multilanguage**: Support for Spanish and English
- 🤝 **Collaboration**: Share lists and assign tasks to other users
- 📅 **Calendar**: Calendar view for your tasks and events
- 🔍 **Global Search**: Quick command (Ctrl+K) to navigate and search
- 📱 **Responsive**: Design adapted to mobile, tablet, and desktop

## 🛠️ Technologies

### Frontend

- **React 19** - User interface library
- **Vite** - Build tool and fast development
- **TailwindCSS 4** - Utility-first CSS framework
- **Shadcn/ui** - Re-usable component library built on Radix UI and TailwindCSS
- **Radix UI** - Unstyled accessible primitive components (used by shadcn/ui)
- **React Router** - Navigation and routing
- **i18next** - Internationalization
- **Lucide React** - Modern icon library
- **date-fns** - Date manipulation
- **Sonner** - Beautiful toast notifications
- **CMDK** - Command menu component for search functionality

### Backend

- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **Supabase** - Backend as a Service (BaaS)
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **express-validator** - Data validation

### Database

- **PostgreSQL** (via Supabase)
- Main tables:
  - `profiles` - User profiles
  - `lists` - Task lists
  - `tasks` - Tasks
  - `tags` - Tags
  - `classroom_integrations` - Google Classroom integration
  - `events` - Calendar events

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### 1. Clone the repository

```bash
git clone https://github.com/rub3nnn/FlickDo.git
cd FlickDo
```

### 2. Set up the database

1. Create a project on [Supabase](https://supabase.com)
2. Run the SQL script in `database/fulldatabase.sql` in the Supabase SQL Editor
3. Get your Supabase credentials (URL and Anon Key)

### 3. Set up the Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# JWT
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d
```

### 4. Set up the Frontend

```bash
cd ../client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001
```

## 🚀 Usage

### Development

Start the backend:

```bash
cd server
npm run dev
```

In another terminal, start the frontend:

```bash
cd client
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Production

**Frontend:**

```bash
cd client
npm run build
npm run preview
```

**Backend:**

```bash
cd server
npm start
```

## 📡 API

### Main Endpoints

#### Authentication

```
POST   /api/auth/register       - Register user
POST   /api/auth/login          - Login
POST   /api/auth/logout         - Logout
GET    /api/auth/me             - Get current user
```

#### Tasks

```
GET    /api/tasks               - Get all tasks
POST   /api/tasks               - Create task
GET    /api/tasks/:id           - Get specific task
PUT    /api/tasks/:id           - Update task
DELETE /api/tasks/:id           - Delete task
PATCH  /api/tasks/:id/complete  - Complete/uncomplete task
```

#### Lists

```
GET    /api/lists               - Get all lists
POST   /api/lists               - Create list
GET    /api/lists/:id           - Get specific list
PUT    /api/lists/:id           - Update list
DELETE /api/lists/:id           - Delete list
POST   /api/lists/:id/share     - Share list
```

#### Tags

```
GET    /api/tags                - Get all tags
POST   /api/tags                - Create tag
PUT    /api/tags/:id            - Update tag
DELETE /api/tags/:id            - Delete tag
```

#### Users

```
GET    /api/users               - Search users
GET    /api/users/:id           - Get user
```

For more details, check the included Postman collection: `FlickDo.postman_collection.json`

## 📁 Project Structure

```
FlickDo/
├── client/                   # React Frontend
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # Context API
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities and configuration
│   │   ├── locales/         # Translations
│   │   └── services/        # API services
│   └── package.json
├── server/                  # Express Backend
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── controllers/     # Controllers
│   │   ├── middleware/      # Middlewares
│   │   ├── routes/          # Routes
│   │   └── validators/      # Validators
│   └── package.json
├── database/                # SQL scripts
│   └── fulldatabase.sql
└── README.md
```

## 🎨 Screenshots

### LOGIN

![Login](/docs/imgs/image-1.png)

### HOME

![Home](/docs/imgs/image-2.png)

### TASK LISTS

![Task Lists](/docs/imgs/image-3.png)

## 🔐 Authentication

FlickDo uses JWT and Supabase Auth based authentication. Users can:

- Register with email and password
- Login
- OAuth authentication (Google, GitHub, etc.) through Supabase
- Password recovery

## 🌍 Internationalization

The application supports multiple languages using i18next:

- 🇪🇸 Spanish
- 🇬🇧 English

Translations are located in `client/src/locales/`

## 🤝 Contributing

Contributions are welcome. For major changes:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is under the MIT License. See the `LICENSE` file for more details.

---

<div align="center">

**Do you like FlickDo? Give the repository a ⭐!**

</div>
