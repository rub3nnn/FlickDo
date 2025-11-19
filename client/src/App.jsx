import { useState, useEffect } from "react";
import "./styles.css";
import {
  CheckCircle2,
  Circle,
  Plus,
  Calendar,
  Search,
  Bell,
  Settings,
  ChevronDown,
  Clock,
  Flag,
  Menu,
  LogOut,
  LayoutGrid,
  Inbox,
  MoreHorizontal,
  Zap,
  Users,
  MapPin,
  ExternalLink,
  AlertCircle,
  GraduationCap,
  Moon,
  Sun,
} from "lucide-react";

const TASKS = [
  {
    id: 1,
    title: "Ensayo sobre literatura medieval",
    priority: "high",
    status: "todo",
    dueDate: "Hoy 23:59",
    daysLeft: 0,
    type: "classroom",
    subject: "Literatura Española",
    teacher: "Prof. García",
    progress: 0,
  },
  {
    id: 2,
    title: "Problemas de cálculo del capítulo 5",
    priority: "high",
    status: "in-progress",
    dueDate: "Mañana 18:00",
    daysLeft: 1,
    type: "classroom",
    subject: "Matemáticas II",
    teacher: "Dr. Rodríguez",
    progress: 45,
  },
  {
    id: 3,
    title: "Diseñar nueva landing page",
    priority: "high",
    status: "in-progress",
    dueDate: "Hoy",
    daysLeft: 0,
    type: "work",
    project: "Marketing",
    progress: 65,
  },
  {
    id: 4,
    title: "Reunión con equipo de diseño",
    priority: "medium",
    status: "todo",
    dueDate: "Hoy 16:00",
    daysLeft: 0,
    type: "work",
    project: "Diseño",
    progress: 0,
  },
  {
    id: 5,
    title: "Proyecto de investigación en grupo",
    priority: "medium",
    status: "in-progress",
    dueDate: "25 Nov",
    daysLeft: 7,
    type: "classroom",
    subject: "Biología",
    teacher: "Dra. Martínez",
    progress: 30,
  },
  {
    id: 6,
    title: "Revisar propuesta de cliente",
    priority: "medium",
    status: "todo",
    dueDate: "Mañana",
    daysLeft: 1,
    type: "work",
    project: "Ventas",
    progress: 0,
  },
];

const EVENTS = [
  {
    id: 1,
    title: "Daily Standup",
    time: "09:00",
    attendees: 5,
    type: "meeting",
    location: "Zoom",
  },
  {
    id: 2,
    title: "Presentación Q4",
    time: "14:30",
    attendees: 12,
    type: "presentation",
    location: "Sala 301",
    urgent: true,
  },
  {
    id: 3,
    title: "Review de diseño",
    time: "16:00",
    attendees: 3,
    type: "meeting",
    location: "Virtual",
  },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState(TASKS);
  const [filter, setFilter] = useState("all");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "completed" ? "todo" : "completed",
              progress: task.status === "completed" ? 0 : 100,
            }
          : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.type === filter;
  });

  const classroomTasks = tasks.filter(
    (t) => t.type === "classroom" && t.status !== "completed"
  );
  const urgentTasks = tasks.filter(
    (t) => t.daysLeft === 0 && t.status !== "completed"
  );

  const navItems = [
    { icon: LayoutGrid, label: "Dashboard", id: "dashboard" },
    {
      icon: Inbox,
      label: "Todas las tareas",
      id: "tasks",
      badge: tasks.filter((t) => t.status !== "completed").length,
    },
    { icon: Calendar, label: "Calendario", id: "calendar" },
    {
      icon: GraduationCap,
      label: "Google Classroom",
      id: "classroom",
      badge: classroomTasks.length,
    },
  ];

  const projects = [
    { name: "Marketing", count: 3, color: "purple" },
    { name: "Diseño", count: 2, color: "pink" },
  ];

  return (
    <div className="dashboard-container">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src="/logo.png" alt="FlickDo Logo" className="logo-image" />
          <span className="logo-text">FlickDo</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${item.id === "dashboard" ? "active" : ""}`}
            >
              <item.icon className="icon-sm" />
              <span className="nav-label">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          ))}

          <div className="nav-section">
            <div className="nav-section-header">
              <h3 className="nav-section-title">Proyectos</h3>
            </div>
            <div className="nav-section-items">
              {projects.map((project) => (
                <button key={project.name} className="nav-item">
                  <div className={`project-dot ${project.color}`} />
                  <span className="nav-label">{project.name}</span>
                  <span className="project-count">{project.count}</span>
                </button>
              ))}
              <button className="nav-item secondary">
                <Plus className="icon-sm" />
                <span>Nuevo</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="user-menu-button"
          >
            <div className="user-avatar">MC</div>
            <div className="user-info">
              <p className="user-name">María Chuchumeca</p>
              <p className="user-email">chuchumeca@gmail.com</p>
            </div>
            <ChevronDown
              className={`icon-sm chevron ${userMenuOpen ? "rotated" : ""}`}
            />
          </button>

          {userMenuOpen && (
            <div className="user-dropdown">
              <button className="dropdown-item">
                <Settings className="icon-sm" />
                Configuración
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="dropdown-item"
              >
                {darkMode ? (
                  <>
                    <Sun className="icon-sm" />
                    Modo claro
                  </>
                ) : (
                  <>
                    <Moon className="icon-sm" />
                    Modo oscuro
                  </>
                )}
              </button>
              <button className="dropdown-item danger">
                <LogOut className="icon-sm" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="menu-button mobile-only"
              >
                <Menu className="icon-md" />
              </button>

              <div>
                <h1 className="header-title">Bienvenida, María</h1>
                <p className="header-subtitle">Martes, 18 de Noviembre 2025</p>
              </div>
            </div>

            <div className="header-right">
              <div className="search-container desktop-only">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="search-input"
                />
              </div>

              <button className="icon-button mobile-only">
                <Search className="icon-md" />
              </button>

              <button className="icon-button notification-button">
                <Bell className="icon-md" />
                <span className="notification-dot" />
              </button>
            </div>
          </div>
        </header>

        <div className="content-area">
          <div className="content-wrapper">
            <div className="stats-grid">
              <div className="stat-card urgent">
                <div className="stat-bg-circle" />
                <div className="stat-content">
                  <div className="stat-header">
                    <AlertCircle className="icon-sm" />
                    <span className="stat-label">Urgente</span>
                  </div>
                  <p className="stat-value">{urgentTasks.length}</p>
                  <p className="stat-description">Para hoy</p>
                </div>
              </div>

              <div className="stat-card classroom">
                <div className="stat-bg-circle" />
                <div className="stat-content">
                  <div className="stat-header">
                    <GraduationCap className="icon-sm" />
                    <span className="stat-label">Classroom</span>
                  </div>
                  <p className="stat-value">{classroomTasks.length}</p>
                  <p className="stat-description">Asignaciones</p>
                </div>
              </div>

              <div className="stat-card progress">
                <div className="stat-bg-circle" />
                <div className="stat-content">
                  <div className="stat-header">
                    <Clock className="icon-sm" />
                    <span className="stat-label">En progreso</span>
                  </div>
                  <p className="stat-value">
                    {tasks.filter((t) => t.status === "in-progress").length}
                  </p>
                  <p className="stat-description">Tareas activas</p>
                </div>
              </div>

              <div className="stat-card completed">
                <div className="stat-bg-circle" />
                <div className="stat-content">
                  <div className="stat-header">
                    <CheckCircle2 className="icon-sm" />
                    <span className="stat-label">Completadas</span>
                  </div>
                  <p className="stat-value">
                    {tasks.filter((t) => t.status === "completed").length}
                  </p>
                  <p className="stat-description">Esta semana</p>
                </div>
              </div>
            </div>

            <div className="main-grid">
              <div className="tasks-column">
                <div className="tasks-header">
                  <div className="tasks-title-wrapper">
                    <div className="tasks-title-group">
                      <h2 className="section-title">Mis Tareas</h2>
                      <span className="title-badge">
                        {
                          filteredTasks.filter((t) => t.status !== "completed")
                            .length
                        }
                      </span>
                    </div>
                    <button className="add-task-button">
                      <Plus className="icon-sm" />
                      Nueva tarea
                    </button>
                  </div>

                  <div className="filter-buttons">
                    {[
                      {
                        id: "all",
                        label: "Todas",
                        count: tasks.filter((t) => t.status !== "completed")
                          .length,
                      },
                      {
                        id: "work",
                        label: "Trabajo",
                        count: tasks.filter(
                          (t) => t.type === "work" && t.status !== "completed"
                        ).length,
                      },
                      {
                        id: "classroom",
                        label: "Classroom",
                        count: tasks.filter(
                          (t) =>
                            t.type === "classroom" && t.status !== "completed"
                        ).length,
                      },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`filter-button ${
                          filter === f.id ? "active" : ""
                        }`}
                      >
                        {f.label}
                        <span className="filter-count">{f.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tasks-list">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="task-card">
                      <div className="task-content">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="task-checkbox"
                        >
                          {task.status === "completed" ? (
                            <CheckCircle2 className="icon-md checked" />
                          ) : (
                            <Circle className="icon-md unchecked" />
                          )}
                        </button>

                        <div className="task-details">
                          <div className="task-title-row">
                            <h4
                              className={`task-title ${
                                task.status === "completed" ? "completed" : ""
                              }`}
                            >
                              {task.title}
                            </h4>
                            {task.priority === "high" &&
                              task.status !== "completed" && (
                                <div className="urgent-badge">
                                  <Flag className="icon-xs" />
                                  <span>URGENTE</span>
                                </div>
                              )}
                          </div>

                          <div className="task-meta">
                            {task.type === "classroom" ? (
                              <>
                                <span className="task-badge classroom">
                                  {task.subject}
                                </span>
                                <span className="task-teacher">
                                  {task.teacher}
                                </span>
                              </>
                            ) : (
                              <span className="task-badge work">
                                {task.project}
                              </span>
                            )}
                            <div className="task-due">
                              <Clock className="icon-xs" />
                              <span>{task.dueDate}</span>
                            </div>
                          </div>

                          {task.status === "in-progress" && (
                            <div className="progress-wrapper">
                              <div className="progress-bar">
                                <div
                                  className="progress-fill"
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                              <span className="progress-text">
                                {task.progress}%
                              </span>
                            </div>
                          )}
                        </div>

                        <button className="task-menu">
                          <MoreHorizontal className="icon-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sidebar-column">
                <div className="widget events-widget">
                  <div className="widget-header">
                    <h3 className="widget-title">Eventos Hoy</h3>
                    <button className="widget-link">Ver todo</button>
                  </div>
                  <div className="events-list">
                    {EVENTS.map((event) => (
                      <div key={event.id} className="event-card">
                        <div className="event-time">
                          <span className="time-hour">
                            {event.time.split(":")[0]}
                          </span>
                          <span className="time-minute">
                            {event.time.split(":")[1]}
                          </span>
                        </div>
                        <div className="event-details">
                          <h4 className="event-title">{event.title}</h4>
                          <div className="event-meta">
                            <div className="event-meta-item">
                              <Users className="icon-xs" />
                              <span>{event.attendees}</span>
                            </div>
                            <span>•</span>
                            <div className="event-meta-item">
                              <MapPin className="icon-xs" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                        {event.urgent && <div className="event-urgent-dot" />}
                      </div>
                    ))}
                  </div>
                  <button className="widget-button">
                    <Calendar className="icon-sm" />
                    Abrir calendario
                  </button>
                </div>

                <div className="widget classroom-widget">
                  <div className="widget-header">
                    <div className="widget-title-group">
                      <div className="classroom-icon">
                        <GraduationCap className="icon-sm" />
                      </div>
                      <h3 className="widget-title">Classroom</h3>
                    </div>
                    <span className="classroom-badge">
                      {classroomTasks.length}
                    </span>
                  </div>
                  <div className="classroom-list">
                    {classroomTasks.slice(0, 4).map((task) => (
                      <div key={task.id} className="classroom-card">
                        <p className="classroom-task-title">{task.title}</p>
                        <div className="classroom-task-footer">
                          <span className="classroom-subject">
                            {task.subject}
                          </span>
                          <span
                            className={`classroom-days ${
                              task.daysLeft === 0 ? "urgent" : ""
                            }`}
                          >
                            {task.daysLeft === 0 ? "Hoy" : `${task.daysLeft}d`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="widget-button primary">
                    <ExternalLink className="icon-sm" />
                    Abrir Classroom
                  </button>
                </div>

                <div className="widget quick-actions">
                  <div className="quick-actions-header">
                    <Zap className="icon-md" />
                    <h3 className="widget-title">Acciones Rápidas</h3>
                  </div>
                  <div className="quick-actions-list">
                    <button className="quick-action-button">
                      <Plus className="icon-sm" />
                      Nueva tarea
                    </button>
                    <button className="quick-action-button">
                      <Calendar className="icon-sm" />
                      Agendar evento
                    </button>
                    <button className="quick-action-button">
                      <Users className="icon-sm" />
                      Compartir proyecto
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
