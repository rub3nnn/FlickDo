import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Header } from "./components/Header/Header";
import { StatsGrid } from "./components/Stats/StatsGrid";
import { TasksList } from "./components/Tasks/TasksList";
import { TasksListSkeleton } from "./components/Tasks/TasksListSkeleton";
import { EventsWidget } from "./components/Widgets/EventsWidget";
import { ClassroomWidget } from "./components/Widgets/ClassroomWidget";
import { QuickActions } from "./components/Widgets/QuickActions";
import { WidgetsSkeleton } from "./components/Widgets/WidgetsSkeleton";
import { useAllTasks } from "./hooks/useAllTasks";
import { EVENTS } from "./data/constants";
import "./styles.css";

export default function Home() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  // Función para mostrar errores
  const handleError = (errorKey) => {
    toast.error(t(`tasks.${errorKey}`));
  };

  // Obtener todas las tareas del usuario desde el backend
  // No incluir tareas completadas para mejorar performance
  // OPTIMIZADO: El backend devuelve tasks y lists por separado
  const {
    tasks,
    lists, // ← Las listas ya vienen optimizadas con sus tags
    loading,
    error,
    toggleTaskCompleted,
    updateTask,
    deleteTask,
    createTask,
  } = useAllTasks({
    includeCompleted: true, // Cargar también completadas para mostrar las retrasadas
    autoLoad: true,
    onError: handleError, // ← Callback para manejar errores
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      await toggleTaskCompleted(id, task.is_completed);
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
            ) : (
              <>
                <StatsGrid tasks={tasks} />

                <div className="main-grid">
                  <TasksList
                    tasks={tasks}
                    lists={lists}
                    filter={filter}
                    onFilterChange={setFilter}
                    onToggleTask={toggleTask}
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
    </div>
  );
}
