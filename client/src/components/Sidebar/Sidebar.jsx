import { LayoutGrid, Inbox, Calendar, GraduationCap, Plus } from "lucide-react";
import { Logo } from "./Logo";
import { NavItem } from "./NavItem";
import { ProjectItem } from "./ProjectItem";
import { UserMenu } from "./UserMenu";
import { PROJECTS } from "../../data/constants";

export const Sidebar = ({
  isOpen,
  onClose,
  tasks,
  darkMode,
  onToggleDarkMode,
}) => {
  const classroomTasks = tasks.filter(
    (t) => t.type === "classroom" && t.status !== "completed"
  );

  const navItems = [
    { icon: LayoutGrid, label: "Dashboard", id: "dashboard", active: true },
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

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <Logo />

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              active={item.active}
            />
          ))}

          <div className="nav-section">
            <div className="nav-section-header">
              <h3 className="nav-section-title">Proyectos</h3>
            </div>
            <div className="nav-section-items">
              {PROJECTS.map((project) => (
                <ProjectItem
                  key={project.name}
                  name={project.name}
                  count={project.count}
                  color={project.color}
                />
              ))}
              <button className="nav-item secondary">
                <Plus className="icon-sm" />
                <span>Nuevo</span>
              </button>
            </div>
          </div>
        </nav>

        <UserMenu darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
      </aside>
    </>
  );
};
