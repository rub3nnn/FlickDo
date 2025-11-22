import { useState, useEffect } from "react";
import { Header } from "./components/Header/Header";
import { TaskCard } from "./components/Tasks/TaskCard";
import { useTranslation } from "react-i18next";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Users,
  Lock,
  Globe,
  Star,
  Circle,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  ListTodo,
  Calendar,
  Trash2,
  Share2,
  Edit3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Datos de ejemplo con listas
const TASK_LISTS = [
  {
    id: "personal",
    name: "Personal",
    icon: Star,
    color: "#f59e0b",
    isShared: false,
    isDefault: true,
    tasks: [
      {
        id: 1,
        title: "Comprar regalo de cumpleaños",
        priority: "high",
        status: "todo",
        dueDate: "Hoy 18:00",
        type: "personal",
        progress: 0,
      },
      {
        id: 2,
        title: "Renovar suscripción de gimnasio",
        priority: "medium",
        status: "todo",
        dueDate: "Mañana",
        type: "personal",
        progress: 0,
      },
    ],
  },
  {
    id: "work",
    name: "Proyectos de Trabajo",
    icon: Briefcase,
    color: "#9333ea",
    isShared: true,
    sharedWith: ["Ana García", "Carlos López", "+3"],
    tasks: [
      {
        id: 3,
        title: "Diseñar nueva landing page",
        priority: "high",
        status: "in-progress",
        dueDate: "Hoy",
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
        type: "work",
        project: "Diseño",
        progress: 0,
      },
      {
        id: 5,
        title: "Revisar propuesta de cliente",
        priority: "medium",
        status: "todo",
        dueDate: "Mañana",
        type: "work",
        project: "Ventas",
        progress: 0,
      },
    ],
  },
  {
    id: "classroom",
    name: "Google Classroom",
    icon: GraduationCap,
    color: "#3b82f6",
    isShared: false,
    isSync: true,
    tasks: [
      {
        id: 6,
        title: "Ensayo sobre literatura medieval",
        priority: "high",
        status: "todo",
        dueDate: "Hoy 23:59",
        type: "classroom",
        subject: "Literatura Española",
        teacher: "Prof. García",
        progress: 0,
      },
      {
        id: 7,
        title: "Problemas de cálculo del capítulo 5",
        priority: "high",
        status: "in-progress",
        dueDate: "Mañana 18:00",
        type: "classroom",
        subject: "Matemáticas II",
        teacher: "Dr. Rodríguez",
        progress: 45,
      },
      {
        id: 8,
        title: "Proyecto de investigación en grupo",
        priority: "medium",
        status: "in-progress",
        dueDate: "25 Nov",
        type: "classroom",
        subject: "Biología",
        teacher: "Dra. Martínez",
        progress: 30,
      },
    ],
  },
  {
    id: "shopping",
    name: "Lista de Compras",
    icon: ListTodo,
    color: "#10b981",
    isShared: true,
    sharedWith: ["Mi familia"],
    tasks: [
      {
        id: 9,
        title: "Leche y cereales",
        priority: "low",
        status: "todo",
        dueDate: "Hoy",
        type: "shopping",
        progress: 0,
      },
      {
        id: 10,
        title: "Frutas y verduras",
        priority: "medium",
        status: "todo",
        dueDate: "Hoy",
        type: "shopping",
        progress: 0,
      },
    ],
  },
  {
    id: "events",
    name: "Eventos y Reuniones",
    icon: Calendar,
    color: "#ec4899",
    isShared: false,
    tasks: [
      {
        id: 11,
        title: "Cita médica anual",
        priority: "high",
        status: "todo",
        dueDate: "23 Nov 10:00",
        type: "events",
        progress: 0,
      },
    ],
  },
];

export default function AllTasks() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskLists, setTaskLists] = useState(TASK_LISTS);
  const [collapsedCompletedSections, setCollapsedCompletedSections] = useState(
    // Por defecto, todas las secciones de completadas están colapsadas
    TASK_LISTS.reduce((acc, list) => ({ ...acc, [list.id]: true }), {})
  );
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleTask = (listId, taskId) => {
    setTaskLists(
      taskLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      status:
                        task.status === "completed" ? "todo" : "completed",
                      progress: task.status === "completed" ? 0 : 100,
                    }
                  : task
              ),
            }
          : list
      )
    );
  };

  const toggleCompletedSection = (listId) => {
    setCollapsedCompletedSections((prev) => ({
      ...prev,
      [listId]: !prev[listId],
    }));
  };

  const handleEditStart = (taskId) => {
    setEditingTaskId(taskId);
  };

  const handleEditEnd = () => {
    setEditingTaskId(null);
  };

  const handleSaveTask = (taskId, editedData) => {
    console.log("Guardar tarea", taskId, editedData);
  };

  // Calculate stats
  const totalTasks = taskLists.reduce(
    (acc, list) => acc + list.tasks.length,
    0
  );
  const activeTasks = taskLists.reduce(
    (acc, list) =>
      acc + list.tasks.filter((t) => t.status !== "completed").length,
    0
  );
  const completedTasks = taskLists.reduce(
    (acc, list) =>
      acc + list.tasks.filter((t) => t.status === "completed").length,
    0
  );
  const sharedLists = taskLists.filter((list) => list.isShared).length;

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="content-area">
          <div className="content-wrapper">
            <div className="all-tasks-container-horizontal">
              {/* Compact Header with Stats */}
              <div className="all-tasks-header-compact-new">
                <div className="header-left-compact">
                  <h1 className="all-tasks-title-compact-new">
                    {t("allTasks.title")}
                  </h1>
                  <div className="stats-inline-compact">
                    <span className="stat-item-inline">
                      <strong>{taskLists.length}</strong>{" "}
                      {t("allTasks.stats.lists")}
                    </span>
                    <span className="stat-divider-inline">•</span>
                    <span className="stat-item-inline">
                      <strong>{activeTasks}</strong>{" "}
                      {t("allTasks.stats.active")}
                    </span>
                    <span className="stat-divider-inline">•</span>
                    <span className="stat-item-inline">
                      <strong>{completedTasks}</strong>{" "}
                      {t("allTasks.stats.completed")}
                    </span>
                    {sharedLists > 0 && (
                      <>
                        <span className="stat-divider-inline">•</span>
                        <span className="stat-item-inline">
                          <strong>{sharedLists}</strong>{" "}
                          {t("allTasks.stats.shared")}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button className="add-list-btn-compact-header">
                  <Plus className="icon-sm" />
                  <span className="desktop-only">{t("allTasks.newList")}</span>
                </button>
              </div>

              {/* Task Lists - Horizontal Scroll Layout */}
              <div className="task-lists-horizontal-wrapper">
                <div className="task-lists-scroll">
                  {taskLists.map((list) => {
                    const ListIcon = list.icon;
                    const activeTasksInList = list.tasks.filter(
                      (t) => t.status !== "completed"
                    );
                    const completedTasksInList = list.tasks.filter(
                      (t) => t.status === "completed"
                    );
                    const isCompletedCollapsed =
                      collapsedCompletedSections[list.id];

                    return (
                      <div key={list.id} className="task-list-card-compact">
                        {/* List Header - Ultra Compact */}
                        <div className="task-list-header-ultra-compact">
                          <div className="header-main-row">
                            <div
                              className="task-list-icon-mini"
                              style={{ background: list.color }}
                            >
                              <ListIcon className="icon-xs" />
                            </div>
                            <h3 className="task-list-title-mini">
                              {list.name}
                            </h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="task-list-menu-btn-mini">
                                  <MoreVertical className="icon-xs" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                  <DropdownMenuItem>
                                    <Plus className="icon-xs" />
                                    {t("allTasks.addTask")}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit3 className="icon-xs" />
                                    {t("allTasks.editList")}
                                  </DropdownMenuItem>
                                  {!list.isShared && (
                                    <DropdownMenuItem>
                                      <Share2 className="icon-xs" />
                                      {t("allTasks.shareList")}
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="icon-xs" />
                                  {t("allTasks.deleteList")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="header-badges-row">
                            {list.isDefault && (
                              <span
                                className="list-badge-mini default"
                                title={t("allTasks.default")}
                              >
                                <Star className="icon-xs" />
                              </span>
                            )}
                            {list.isShared ? (
                              <span
                                className="list-badge-mini shared"
                                title={`${t("allTasks.sharedWith")} ${
                                  list.sharedWith[0]
                                }`}
                              >
                                <Users className="icon-xs" />
                              </span>
                            ) : (
                              <span
                                className="list-badge-mini private"
                                title={t("allTasks.private")}
                              >
                                <Lock className="icon-xs" />
                              </span>
                            )}
                            {list.isSync && (
                              <span
                                className="list-badge-mini sync"
                                title={t("allTasks.synced")}
                              >
                                <Globe className="icon-xs" />
                              </span>
                            )}
                            <span className="task-count-mini">
                              {activeTasksInList.length}
                            </span>
                          </div>
                        </div>

                        {/* List Content - Scrollable */}
                        <div className="task-list-content-compact">
                          {/* Active Tasks */}
                          {activeTasksInList.length > 0 ? (
                            <div className="tasks-list-compact">
                              {activeTasksInList.map((task) => (
                                <TaskCard
                                  key={task.id}
                                  task={task}
                                  onToggle={() => toggleTask(list.id, task.id)}
                                  isEditing={editingTaskId === task.id}
                                  onEditStart={handleEditStart}
                                  onEditEnd={handleEditEnd}
                                  onSave={handleSaveTask}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="list-empty-state-compact">
                              <Circle className="icon-sm" />
                              <p>{t("allTasks.emptyList")}</p>
                            </div>
                          )}

                          {/* Completed Tasks - Collapsible */}
                          {completedTasksInList.length > 0 && (
                            <div className="completed-section-compact">
                              <button
                                className="completed-toggle-compact"
                                onClick={() => toggleCompletedSection(list.id)}
                              >
                                {isCompletedCollapsed ? (
                                  <ChevronRight className="icon-xs" />
                                ) : (
                                  <ChevronDown className="icon-xs" />
                                )}
                                <CheckCircle2 className="icon-xs completed-icon" />
                                <span className="completed-text-compact">
                                  {completedTasksInList.length}
                                </span>
                              </button>

                              {!isCompletedCollapsed && (
                                <div className="tasks-list-compact completed-tasks-compact">
                                  {completedTasksInList.map((task) => (
                                    <TaskCard
                                      key={task.id}
                                      task={task}
                                      onToggle={() =>
                                        toggleTask(list.id, task.id)
                                      }
                                      isEditing={editingTaskId === task.id}
                                      onEditStart={handleEditStart}
                                      onEditEnd={handleEditEnd}
                                      onSave={handleSaveTask}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* List Footer */}
                        <div className="task-list-footer-compact">
                          <button className="add-task-btn-footer">
                            <Plus className="icon-xs" />
                            {t("allTasks.addTask")}
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add New List Card */}
                  <div className="task-list-card-compact add-list-card">
                    <div className="add-list-content">
                      <div className="add-list-icon">
                        <Plus className="icon-lg" />
                      </div>
                      <h3 className="add-list-title">
                        {t("allTasks.newList")}
                      </h3>
                      <p className="add-list-description">
                        {t("allTasks.createNewList")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty State for No Lists */}
              {taskLists.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <ListTodo className="icon-xl" />
                  </div>
                  <h3 className="empty-state-title">{t("allTasks.noLists")}</h3>
                  <p className="empty-state-description">
                    {t("allTasks.createFirstList")}
                  </p>
                  <button className="add-task-button-large">
                    <Plus className="icon-md" />
                    {t("allTasks.newList")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
