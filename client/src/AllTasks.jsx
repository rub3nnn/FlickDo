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
  LayoutGrid,
  Columns3,
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
      {
        id: 12,
        title: "Llamar al dentista",
        priority: "low",
        status: "completed",
        dueDate: "Ayer",
        type: "personal",
        progress: 100,
      },
      {
        id: 13,
        title: "Leer artículo sobre productividad",
        priority: "low",
        status: "completed",
        dueDate: "20 Nov",
        type: "personal",
        progress: 100,
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
      {
        id: 14,
        title: "Enviar reporte mensual",
        priority: "high",
        status: "completed",
        dueDate: "19 Nov",
        type: "work",
        project: "Administración",
        progress: 100,
      },
      {
        id: 15,
        title: "Actualizar documentación del proyecto",
        priority: "medium",
        status: "completed",
        dueDate: "18 Nov",
        type: "work",
        project: "Desarrollo",
        progress: 100,
      },
      {
        id: 16,
        title: "Preparar presentación para cliente",
        priority: "high",
        status: "completed",
        dueDate: "17 Nov",
        type: "work",
        project: "Ventas",
        progress: 100,
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
  const [viewMode, setViewMode] = useState(() => {
    // Cargar preferencia de vista desde localStorage
    const savedView = localStorage.getItem("taskListViewMode");
    return savedView || "grid"; // 'grid' o 'columns'
  });

  // Guardar preferencia de vista cuando cambie
  useEffect(() => {
    localStorage.setItem("taskListViewMode", viewMode);
  }, [viewMode]);

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
          <div
            className="content-wrapper"
            style={
              {
                padding: "24px 0 4px 0",
              } /*LUEGO LE PONGO LOS MARGENES A LOS ELEMENTOS, PARA QUE EL SCROLL SOBRESALGA*/
            }
          >
            <div className="all-tasks-container-horizontal">
              {/* Compact Header with Stats */}
              <div
                className="all-tasks-header-compact-new"
                style={{
                  padding: "0 24px 0 24px",
                }}
              >
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
                <div className="header-right-actions">
                  {/* View Mode Toggle */}
                  <div className="view-mode-toggle">
                    <button
                      className={`view-toggle-btn ${
                        viewMode === "grid" ? "active" : ""
                      }`}
                      onClick={() => setViewMode("grid")}
                      title={t("allTasks.gridView") || "Vista de cuadrícula"}
                    >
                      <LayoutGrid className="icon-sm" />
                    </button>
                    <button
                      className={`view-toggle-btn ${
                        viewMode === "columns" ? "active" : ""
                      }`}
                      onClick={() => setViewMode("columns")}
                      title={t("allTasks.columnView") || "Vista de columnas"}
                    >
                      <Columns3 className="icon-sm" />
                    </button>
                  </div>
                  <button className="add-list-btn-compact-header">
                    <Plus className="icon-sm" />
                    <span className="desktop-only">
                      {t("allTasks.newList")}
                    </span>
                  </button>
                </div>
              </div>

              {/* Task Lists - Dynamic Layout */}
              <div
                className={
                  viewMode === "grid"
                    ? "task-lists-grid-wrapper"
                    : "task-lists-columns-wrapper"
                }
              >
                <div
                  className={
                    viewMode === "grid"
                      ? "task-lists-grid"
                      : "task-lists-columns"
                  }
                >
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
                                  availableTags={[]}
                                  onCreateTag={async () => {}}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="list-empty-state-compact">
                              <Circle className="icon-sm" />
                              <p>{t("allTasks.emptyList")}</p>
                            </div>
                          )}
                        </div>

                        {/* Completed Tasks Section - Between Content and Footer */}
                        {completedTasksInList.length > 0 && (
                          <div
                            className={`completed-section-middle ${
                              !isCompletedCollapsed ? "expanded" : ""
                            }`}
                          >
                            <button
                              className="completed-toggle-trigger"
                              onClick={() => toggleCompletedSection(list.id)}
                            >
                              {isCompletedCollapsed ? (
                                <ChevronDown className="icon-xs" />
                              ) : (
                                <ChevronRight className="icon-xs" />
                              )}
                              <CheckCircle2 className="icon-xs completed-icon" />
                              <span className="completed-text-footer">
                                {completedTasksInList.length}{" "}
                                {t("allTasks.stats.completed")}
                              </span>
                            </button>
                            <div className="completed-tasks-container">
                              <div className="completed-tasks-list-expanded">
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
                                    availableTags={[]}
                                    onCreateTag={async () => {}}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

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
