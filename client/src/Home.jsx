import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Header } from "./components/Header/Header";
import { StatsGrid } from "./components/Stats/StatsGrid";
import { TasksList } from "./components/Tasks/TasksList";
import { EventsWidget } from "./components/Widgets/EventsWidget";
import { ClassroomWidget } from "./components/Widgets/ClassroomWidget";
import { QuickActions } from "./components/Widgets/QuickActions";
import { TASKS, EVENTS } from "./data/constants";
import "./styles.css";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState(TASKS);
  const [filter, setFilter] = useState("all");

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

  const classroomTasks = tasks.filter(
    (t) => t.type === "classroom" && t.status !== "completed"
  );

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="content-area">
          <div className="content-wrapper">
            <StatsGrid tasks={tasks} />

            <div className="main-grid">
              <TasksList
                tasks={tasks}
                filter={filter}
                onFilterChange={setFilter}
                onToggleTask={toggleTask}
              />

              <div className="sidebar-column">
                <EventsWidget events={EVENTS} />
                <ClassroomWidget classroomTasks={classroomTasks} />
                <QuickActions />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
