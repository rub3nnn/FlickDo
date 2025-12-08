import { useState } from "react";
import { LayoutGrid, Inbox, Calendar, GraduationCap, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { NavItem } from "./NavItem";
import { ProjectItem } from "./ProjectItem";
import { useTasks } from "../../contexts/TasksContext";
import { UserMenu } from "./UserMenu";
import {
  Sidebar as SidebarLibrary,
  SidebarContent,
} from "@/components/ui/sidebar";
import { PROJECTS } from "../../data/constants";
import { CreateListDialog } from "../Lists/CreateListDialog";

export const Sidebar = ({}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [createListOpen, setCreateListOpen] = useState(false);
  const [isCreatingList, setIsCreatingList] = useState(false);

  const navItems = [
    {
      icon: LayoutGrid,
      label: t("sidebar.dashboard"),
      id: "dashboard",
      path: "/dashboard",
      active: true,
    },
    {
      icon: Inbox,
      label: t("sidebar.allTasks"),
      id: "tasks",
      path: "/all-tasks",
      active: true,
    },
    {
      icon: Calendar,
      label: t("sidebar.calendar"),
      id: "calendar",
      path: "/calendar",
      active: false,
    },
    {
      icon: GraduationCap,
      label: t("sidebar.googleClassroom"),
      id: "classroom",
      path: "/classroom",
      active: false,
    },
  ];

  const { lists, createList } = useTasks();

  const handleCreateList = async (listData) => {
    setIsCreatingList(true);
    try {
      const result = await createList(listData);
      if (result?.success && result.data?.id) {
        navigate(`/list/${result.data.id}`);
      }
      return result;
    } finally {
      setIsCreatingList(false);
    }
  };

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
                disabled={!item.active}
              />
            ))}

            <div className="nav-section">
              <div className="nav-section-header">
                <h3 className="nav-section-title">{t("allTasks.title")}</h3>
              </div>
              <div className="nav-section-items">
                {lists.map((list) => {
                  // Contar tareas activas directamente de list.tasks
                  const count = (list.tasks || []).filter(
                    (t) => !t.is_completed
                  ).length;
                  return (
                    <ProjectItem
                      key={list.id}
                      id={list.id}
                      name={list.title}
                      count={count}
                      color={list.color}
                    />
                  );
                })}
                <button
                  className="nav-item secondary"
                  onClick={() => setCreateListOpen(true)}
                >
                  <Plus className="icon-sm" />
                  <span>{t("sidebar.new")}</span>
                </button>
              </div>
            </div>
          </nav>

          <UserMenu />
        </SidebarContent>
      </SidebarLibrary>

      <CreateListDialog
        open={createListOpen}
        onOpenChange={setCreateListOpen}
        onCreateList={handleCreateList}
        isLoading={isCreatingList}
      />
    </>
  );
};
