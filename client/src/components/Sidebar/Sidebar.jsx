import { LayoutGrid, Inbox, Calendar, GraduationCap, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: LayoutGrid,
      label: t("sidebar.dashboard"),
      id: "dashboard",
      path: "/",
    },
    {
      icon: Inbox,
      label: t("sidebar.allTasks"),
      id: "tasks",
      path: "/all-tasks",
      badge: 2,
    },
    {
      icon: Calendar,
      label: t("sidebar.calendar"),
      id: "calendar",
      path: "/calendar",
    },
    {
      icon: GraduationCap,
      label: t("sidebar.googleClassroom"),
      id: "classroom",
      path: "/classroom",
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
                active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}

            <div className="nav-section">
              <div className="nav-section-header">
                <h3 className="nav-section-title">{t("sidebar.projects")}</h3>
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
                  <span>{t("sidebar.new")}</span>
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
