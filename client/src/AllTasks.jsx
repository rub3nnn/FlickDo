import { useState, useEffect, useMemo } from "react";
import { Header } from "./components/Header/Header";
import { TaskCard } from "./components/Tasks/TaskCard";
import { EmptyState } from "./components/EmptyState/EmptyState";
import { useTranslation } from "react-i18next";
import { useTasks } from "./contexts/TasksContext";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Users,
  Lock,
  Star,
  Circle,
  CheckCircle2,
  Trash2,
  Share2,
  Edit3,
  Settings,
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

export default function AllTasks() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Obtener tareas y listas del contexto global
  const { tasks, lists, loading, error } = useTasks();

  const [collapsedCompletedSections, setCollapsedCompletedSections] = useState(
    {}
  );
  const [viewMode, setViewMode] = useState(() => {
    // Cargar preferencia de vista desde localStorage
    const savedView = localStorage.getItem("taskListViewMode");
    return savedView || "grid"; // 'grid' o 'columns'
  });

  // Inicializar secciones colapsadas cuando las listas se cargan
  useEffect(() => {
    if (
      lists.length > 0 &&
      Object.keys(collapsedCompletedSections).length === 0
    ) {
      setCollapsedCompletedSections(
        lists.reduce((acc, list) => ({ ...acc, [list.id]: true }), {})
      );
    }
  }, [lists, collapsedCompletedSections]);

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

  const toggleCompletedSection = (listId) => {
    setCollapsedCompletedSections((prev) => ({
      ...prev,
      [listId]: !prev[listId],
    }));
  };

  // Agrupar tareas por lista con useMemo para optimizar
  const tasksByList = useMemo(() => {
    return lists.map((list) => ({
      ...list,
      tasks: tasks.filter((task) => task.list_id === list.id),
    }));
  }, [tasks, lists]);

  // Calculate stats
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((t) => !t.is_completed).length;
  const completedTasks = tasks.filter((t) => t.is_completed).length;
  const sharedLists = lists.filter((list) => list.is_shared).length;

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
              {/* Empty State for No Lists */}
              {!loading && lists.length === 0 ? (
                <EmptyState
                  onCreateList={(listName) =>
                    console.log("Create list:", listName)
                  }
                />
              ) : (
                <>
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
                          <strong>{lists.length}</strong>{" "}
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
                          title={
                            t("allTasks.gridView") || "Vista de cuadrícula"
                          }
                        >
                          <LayoutGrid className="icon-sm" />
                        </button>
                        <button
                          className={`view-toggle-btn ${
                            viewMode === "columns" ? "active" : ""
                          }`}
                          onClick={() => setViewMode("columns")}
                          title={
                            t("allTasks.columnView") || "Vista de columnas"
                          }
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
                      {loading ? (
                        // Skeleton Loader
                        <>
                          {[1, 2, 3, 4].map((skeletonId) => (
                            <div
                              key={skeletonId}
                              className="task-list-card-compact skeleton-card"
                            >
                              {/* Skeleton Header */}
                              <div className="task-list-header-ultra-compact">
                                <div className="header-main-row">
                                  <div className="skeleton skeleton-icon-mini"></div>
                                  <div className="skeleton skeleton-title-mini"></div>
                                  <div className="skeleton skeleton-menu-btn"></div>
                                </div>
                                <div className="header-badges-row">
                                  <div className="skeleton skeleton-badge"></div>
                                  <div className="skeleton skeleton-badge"></div>
                                  <div className="skeleton skeleton-count"></div>
                                </div>
                              </div>

                              {/* Skeleton Content */}
                              <div className="task-list-content-compact">
                                <div className="tasks-list-compact">
                                  {[1, 2, 3].map((taskSkeleton) => (
                                    <div
                                      key={taskSkeleton}
                                      className="skeleton-task-card"
                                    >
                                      <div className="skeleton skeleton-task-checkbox"></div>
                                      <div className="skeleton-task-content">
                                        <div className="skeleton skeleton-task-title"></div>
                                        <div className="skeleton skeleton-task-subtitle"></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Skeleton Footer */}
                              <div className="task-list-footer-compact">
                                <div className="skeleton skeleton-footer-btn"></div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : error ? (
                        <div className="error-state">Error: {error}</div>
                      ) : tasksByList.length === 0 ? (
                        <div className="empty-state">
                          No hay listas disponibles
                        </div>
                      ) : (
                        tasksByList.map((list) => {
                          const ListIcon = Star; // Puedes mapear iconos según el tipo de lista
                          const activeTasksInList = list.tasks.filter(
                            (t) => !t.is_completed
                          );
                          const completedTasksInList = list.tasks.filter(
                            (t) => t.is_completed
                          );
                          const isCompletedCollapsed =
                            collapsedCompletedSections[list.id];

                          return (
                            <div
                              key={list.id}
                              className="task-list-card-compact"
                            >
                              {/* List Header - Ultra Compact */}
                              <div className="task-list-header-ultra-compact">
                                <div className="header-main-row">
                                  <div
                                    className="task-list-icon-mini"
                                    style={{
                                      background: list.color || "#9333ea",
                                    }}
                                  >
                                    <ListIcon className="icon-xs" />
                                  </div>
                                  <h3 className="task-list-title-mini">
                                    {list.title}
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
                                          <Edit3 className="icon-xs" />
                                          {t("allTasks.renameList")}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Settings className="icon-xs" />
                                          {t("allTasks.listSettings")}
                                        </DropdownMenuItem>
                                        {!list.is_shared && (
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
                                  {list.is_default && (
                                    <span
                                      className="list-badge-mini default"
                                      title={t("allTasks.default")}
                                    >
                                      <Star className="icon-xs" />
                                    </span>
                                  )}
                                  {list.is_shared ? (
                                    <span
                                      className="list-badge-mini shared"
                                      title={t("allTasks.sharedWith")}
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
                                        hideListBadge={true}
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
                                    onClick={() =>
                                      toggleCompletedSection(list.id)
                                    }
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
                                          hideListBadge={true}
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
                        })
                      )}

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
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
