import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Header } from "./components/Header/Header";
import { StatsGrid } from "./components/Stats/StatsGrid";
import { TasksList } from "./components/Tasks/TasksList";
import { TasksListSkeleton } from "./components/Tasks/TasksListSkeleton";
import { EmptyState } from "./components/EmptyState/EmptyState";
import { EventsWidget } from "./components/Widgets/EventsWidget";
import { ClassroomWidget } from "./components/Widgets/ClassroomWidget";
import { QuickActions } from "./components/Widgets/QuickActions";
import { WidgetsSkeleton } from "./components/Widgets/WidgetsSkeleton";
import { CreateListDialog } from "./components/Lists/CreateListDialog";
import { useTasks } from "./contexts/TasksContext";
import { EVENTS } from "./data/constants";
import "./styles.css";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  // Estado para el modal de crear lista
  const [createListOpen, setCreateListOpen] = useState(false);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [listPreset, setListPreset] = useState({
    title: "",
    icon: "list",
    color: "#4f46e5",
  });

  // Presets para las sugerencias de listas
  const LIST_PRESETS = {
    Trabajo: {
      title: t("allTasks.listSuggestions.work"),
      icon: "briefcase",
      color: "#4f46e5",
    },
    Estudios: {
      title: t("allTasks.listSuggestions.study"),
      icon: "book",
      color: "#9333ea",
    },
    Personal: {
      title: t("allTasks.listSuggestions.personal"),
      icon: "heart",
      color: "#10b981",
    },
  };

  // Obtener todas las tareas del usuario desde el contexto global
  const { tasks, lists, loading, error, updateTask, deleteTask, createList } =
    useTasks();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Manejar apertura del modal con preset opcional
  const handleOpenCreateList = (presetName) => {
    if (presetName && LIST_PRESETS[presetName]) {
      setListPreset({
        title: LIST_PRESETS[presetName].title,
        icon: LIST_PRESETS[presetName].icon,
        color: LIST_PRESETS[presetName].color,
      });
    } else {
      setListPreset({ title: "", icon: "list", color: "#4f46e5" });
    }
    setCreateListOpen(true);
  };

  // Manejar creación de lista y navegar a ella
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

  // Filtrar tareas de classroom que no estén completadas
  const classroomTasks = tasks.filter(
    (t) => t.classroom_integration && !t.is_completed
  );

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="content-area">
          <div className="content-wrapper">
            {error && (
              <div
                className="error-message"
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: "#fee",
                  borderRadius: "8px",
                  color: "#c33",
                }}
              >
                Error cargando tareas: {error}
              </div>
            )}

            {loading ? (
              <>
                <StatsGrid loading />
                <div className="main-grid">
                  <TasksListSkeleton />
                  <WidgetsSkeleton />
                </div>
              </>
            ) : !loading && lists.length === 0 ? (
              <EmptyState onCreateList={handleOpenCreateList} />
            ) : (
              <>
                <StatsGrid tasks={tasks} />

                <div className="main-grid">
                  <TasksList
                    tasks={tasks}
                    lists={lists}
                    filter={filter}
                    onFilterChange={setFilter}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                  />

                  <div className="sidebar-column">
                    <EventsWidget events={EVENTS} />
                    <ClassroomWidget classroomTasks={classroomTasks} />
                    <QuickActions />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <CreateListDialog
        open={createListOpen}
        onOpenChange={setCreateListOpen}
        onCreateList={handleCreateList}
        isLoading={isCreatingList}
        initialTitle={listPreset.title}
        initialIcon={listPreset.icon}
        initialColor={listPreset.color}
      />
    </div>
  );
}
