import { LayoutGrid, Inbox, Calendar, GraduationCap, Plus } from "lucide-react";
import { Logo } from "./Logo";
import { NavItem } from "./NavItem";
import { ProjectItem } from "./ProjectItem";
import { UserMenu } from "./UserMenu";
import {
  Sidebar as SidebarLibrary,
  SidebarContent,
} from "@/components/ui/sidebar";
import { PROJECTS } from "../../data/constants";

export const Sidebar = ({}) => {
  const navItems = [
    { icon: LayoutGrid, label: "Dashboard", id: "dashboard", active: true },
    {
      icon: Inbox,
      label: "Todas las tareas",
      id: "tasks",
      badge: 2,
    },
    { icon: Calendar, label: "Calendario", id: "calendar" },
    {
      icon: GraduationCap,
      label: "Google Classroom",
      id: "classroom",
      badge: 3,
    },
  ];

  return (
    <>
      {/* Esto debería ser un aside, pero le pongo Sidebar para que la librería shadcn lo haga 
    por mi y se encargue de ponerle el index necesario y desplegarla cuando el provider lo diga.
    Sin embargo esto solo es una forma de hacerlo escalable, en el css hay una clase llamada "open"
    que se aplica si está con sidebar y lo único que hay que hacer es con js apicarle la clase o no para que haga
    el efecto de abrir y cerrar con css puro.*/}
      <SidebarLibrary className={`sidebar`}>
        <SidebarContent>
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

          <UserMenu />
        </SidebarContent>
      </SidebarLibrary>
    </>
  );
};
