# Architecture

FlickDo follows a strict three-tier architecture where the frontend communicates **only** with the Express backend. The backend acts as the sole interface to the Supabase database and authentication services.

**Strict Rule: The Client (Frontend) NEVER connects directly to Supabase.**

## System Overview

```mermaid
graph TB
    subgraph Client
        A[React App]
        B[Vite Dev Server]
    end

    subgraph Backend
        C[Express API]
        D[Auth Middleware]
        E[Controllers]
        F[Validators]
    end

    subgraph External
        G[Supabase]
        H[Google APIs]
    end

    A -->|HTTP/REST| C
    C --> D
    D --> E
    E --> F
    E -->|SQL/Auth| G
    E -->|Classroom| H
```

## Technology Stack

### Frontend

| Technology   | Version | Purpose                 |
| ------------ | ------- | ----------------------- |
| React        | 19.2.0  | UI framework            |
| Vite         | 6.0.5   | Build tool & dev server |
| TailwindCSS  | 4.0.0   | Styling                 |
| Shadcn/ui    | Latest  | Component library       |
| React Router | 7.1.1   | Client-side routing     |
| i18next      | 24.2.1  | Internationalization    |
| Recharts     | 2.15.0  | Data visualization      |

### Backend

| Technology        | Version | Purpose                |
| ----------------- | ------- | ---------------------- |
| Node.js           | 18+     | Runtime                |
| Express           | 4.21.2  | Web framework          |
| Supabase          | 2.47.10 | Database & auth client |
| Express Validator | 7.2.1   | Input validation       |

### Database

| Technology         | Purpose             |
| ------------------ | ------------------- |
| Supabase           | PostgreSQL database |
| Row Level Security | Authorization       |

## Project Structure

```
FlickDo/
├── client/               # Frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities
│   │   ├── locales/      # Translations
│   │   ├── services/     # API services
│   │   └── *.jsx         # Pages
│   └── public/           # Static assets
│
├── server/               # Backend API
│   └── src/
│       ├── config/       # Configuration
│       ├── controllers/  # Request handlers
│       ├── middleware/   # Express middleware
│       ├── routes/       # Route definitions
│       └── validators/   # Input validation
│
└── database/             # Database scripts
    └── fulldatabase.sql  # Schema & seed data
```

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthContext
│   ├── Login
│   ├── Home
│   │   ├── Header
│   │   ├── Sidebar
│   │   │   ├── NavItem
│   │   │   └── ProjectItem
│   │   └── TasksList
│   │       ├── TaskCard
│   │       └── TasksFilter
│   ├── ListPage
│   └── Settings
└── CommandContext
    └── GlobalCommand
```

### Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant S as API Service (Axios/Fetch)
    participant B as Backend API

    U->>C: Interaction
    C->>S: Request Data
    S->>B: HTTP Request (GET/POST/etc)
    B-->>S: JSON Response
    S-->>C: Return Data
    C-->>U: Re-render
```

## Backend Architecture

### Layered Structure

```
Request (from Frontend)
  ↓
Middleware (auth, validation)
  ↓
Router
  ↓
Controller
  ↓
Supabase Client (Server-side only)
  ↓
Database
```

### Request Flow

1. **Middleware Layer**
   - Authentication (JWT validation verified against Supabase by Backend)
   - Input validation
   - Error handling

2. **Routing Layer**
   - Map HTTP methods to controllers
   - Organize by resource

3. **Controller Layer**
   - Business logic
   - Database queries via Supabase Admin/Client
   - Response formatting

### Example Flow

```javascript
// Route
router.post('/tasks',
  authMiddleware,           // 1. Authenticate
  validateTask,             // 2. Validate input
  taskController.create     // 3. Execute
)

// Controller
async create(req, res, next) {
  try {
    // Backend talks to Supabase
    const { data, error } = await supabase
      .from('tasks')
      .insert(req.body)

    if (error) throw error
    res.status(201).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
```

## Authentication Flow

**Crucial:** The Frontend does NOT call `supabase.auth.signInWithPassword`. It calls the Backend API.

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant S as Supabase

    U->>F: Enter credentials
    F->>B: POST /auth/login
    B->>S: supabase.auth.signInWithPassword()
    S-->>B: Session (Access Token)
    B-->>F: Return Access Token
    F->>F: Store Token (Context/LocalStorage)
    
    Note over F, B: Subsequent Requests
    
    F->>B: API Request + Bearer Token
    B->>S: Verify Token / Get User
    S-->>B: User Details
    B-->>F: Response
```

## Security

### Frontend
- XSS prevention
- Secure token storage

### Backend
- The only point of contact with Supabase.
- Manages strict validation before sending data to DB.
- Uses Service Role Key (securely) or Auth Context to interact with Supabase.

## Database Architecture

### Schema Design

```mermaid
erDiagram
    users ||--o{ tasks : creates
    users ||--o{ lists : owns
    lists ||--o{ tasks : contains
    tasks ||--o{ task_tags : has
    tags ||--o{ task_tags : applied_to
    lists ||--o{ list_members : has
    users ||--o{ list_members : member_of

    users {
        uuid id PK
        string email
        string name
        jsonb preferences
    }

    tasks {
        int id PK
        uuid user_id FK
        int list_id FK
        string title
        text description
        timestamp due_date
        string priority
        boolean completed
    }

    lists {
        int id PK
        uuid owner_id FK
        string name
        string color
        string icon
    }
```
