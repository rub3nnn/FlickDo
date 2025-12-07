import { useState, useEffect, useMemo } from "react";
import { Header } from "./components/Header/Header";
import { TaskCard } from "./components/Tasks/TaskCard";
import { EmptyState } from "./components/EmptyState/EmptyState";
import { CreateListDialog } from "./components/Lists/CreateListDialog";
import { EditListDialog } from "./components/Lists/EditListDialog";
import { ShareListDialog } from "./components/Lists/ShareListDialog";
import { ListConfigIcons } from "./components/Lists/ListConfigIcons";
import { useTranslation } from "react-i18next";
import { useTasks } from "./contexts/TasksContext";
import { useAuth } from "./hooks/useAuth";
import { toast } from "sonner";
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
  LayoutGrid,
  Columns3,
  List,
  Calendar,
  Tag,
  Briefcase,
  Home,
  Heart,
  Zap,
  Target,
  BookOpen,
  ShoppingCart,
  Music,
  Camera,
  Plane,
  Coffee,
  Gift,
  Gamepad2,
  Palette,
  Dumbbell,
  Lightbulb,
  Code,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mapeo de iconos por nombre (debe coincidir con AVAILABLE_ICONS en CreateListDialog)
const ICON_MAP = {
  list: List,
  star: Star,
  briefcase: Briefcase,
  home: Home,
  heart: Heart,
  book: BookOpen,
  cart: ShoppingCart,
  plane: Plane,
  music: Music,
  camera: Camera,
  coffee: Coffee,
  gamepad: Gamepad2,
  palette: Palette,
  dumbbell: Dumbbell,
  gift: Gift,
  lightbulb: Lightbulb,
  code: Code,
  calendar: Calendar,
  tag: Tag,
  zap: Zap,
  target: Target,
};

export default function AllTasks() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Obtener listas del contexto global (las tareas están dentro de cada lista)
  const {
    lists,
    loading,
    error,
    createList,
    updateList,
    deleteList,
    refreshList,
  } = useTasks();
  const { user } = useAuth();

  // Estados para los dialogs
  const [createListOpen, setCreateListOpen] = useState(false);
  const [editListOpen, setEditListOpen] = useState(false);
  const [shareListOpen, setShareListOpen] = useState(false);
  const [deleteListOpen, setDeleteListOpen] = useState(false);
  const [selectedListForEdit, setSelectedListForEdit] = useState(null);
  const [selectedListForShare, setSelectedListForShare] = useState(null);
  const [selectedListForDelete, setSelectedListForDelete] = useState(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isDeletingList, setIsDeletingList] = useState(false);

  // Presets para crear lista desde EmptyState
  const [createListPreset, setCreateListPreset] = useState({
    title: "",
    icon: "list",
    color: "#4f46e5",
  });

  const [collapsedCompletedSections, setCollapsedCompletedSections] = useState(
    {}
  );
  const [viewMode, setViewMode] = useState(() => {
    // Cargar preferencia de vista desde localStorage
    const savedView = localStorage.getItem("taskListViewMode");
    return savedView || "grid"; // 'grid' o 'columns'
  });
  // Estado para controlar qué lista tiene el TaskCard de creación visible
  const [addingTaskToListId, setAddingTaskToListId] = useState(null);

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

  // Manejar creación de lista
  const handleCreateList = async (listData) => {
    setIsCreatingList(true);
    try {
      const result = await createList(listData);
      if (result?.success) {
        toast.success(t("lists.created"));
        // Resetear presets después de crear
        setCreateListPreset({ title: "", icon: "list", color: "#4f46e5" });
        return { success: true };
      } else {
        toast.error(t("lists.errorCreating"));
        return { success: false };
      }
    } catch (err) {
      toast.error(t("lists.errorCreating"));
      return { success: false };
    } finally {
      setIsCreatingList(false);
    }
  };

  // Abrir diálogo de crear lista con presets opcionales
  const handleOpenCreateList = (presetName) => {
    const presets = {
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

    if (presetName && presets[presetName]) {
      setCreateListPreset(presets[presetName]);
    } else {
      setCreateListPreset({ title: "", icon: "list", color: "#4f46e5" });
    }
    setCreateListOpen(true);
  };

  // Abrir dialog de compartir
  const handleShareList = (list) => {
    setSelectedListForShare(list);
    setShareListOpen(true);
  };

  // Abrir dialog de editar
  const handleEditList = (list) => {
    setSelectedListForEdit(list);
    setEditListOpen(true);
  };

  // Manejar actualización de lista
  const handleUpdateList = async (listId, listData) => {
    try {
      const result = await updateList(listId, listData);
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Abrir diálogo de confirmación de eliminación
  const handleDeleteListClick = (list) => {
    setSelectedListForDelete(list);
    setDeleteListOpen(true);
  };

  // Manejar eliminación de lista
  const handleDeleteList = async () => {
    if (!selectedListForDelete) return;

    setIsDeletingList(true);
    try {
      const result = await deleteList(selectedListForDelete.id);
      if (result?.success) {
        toast.success(t("lists.deleted") || "Lista eliminada");
      } else {
        toast.error(t("lists.errorDeleting") || "Error al eliminar la lista");
      }
    } catch (err) {
      toast.error(t("lists.errorDeleting") || "Error al eliminar la lista");
    } finally {
      setIsDeletingList(false);
      setDeleteListOpen(false);
      setSelectedListForDelete(null);
    }
  };

  // Estadísticas calculadas desde las listas
  const stats = useMemo(() => {
    const allTasks = lists.flatMap((list) => list.tasks || []);
    return {
      totalTasks: allTasks.length,
      activeTasks: allTasks.filter((t) => !t.is_completed).length,
      completedTasks: allTasks.filter((t) => t.is_completed).length,
      sharedLists: lists.filter((list) => list.is_shared).length,
    };
  }, [lists]);

  // Obtener icono de lista (ahora es campo directo, no en configuration)
  const getListIcon = (list) => {
    const iconName = list.icon || "list";
    return ICON_MAP[iconName] || List;
  };

  // Obtener color de lista (ahora es campo directo, no en configuration)
  const getListColor = (list) => {
    return list.color || "#3B82F6";
  };

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
                <EmptyState onCreateList={handleOpenCreateList} />
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
                          <strong>{stats.activeTasks}</strong>{" "}
                          {t("allTasks.stats.active")}
                        </span>
                        <span className="stat-divider-inline">•</span>
                        <span className="stat-item-inline">
                          <strong>{stats.completedTasks}</strong>{" "}
                          {t("allTasks.stats.completed")}
                        </span>
                        {stats.sharedLists > 0 && (
                          <>
                            <span className="stat-divider-inline">•</span>
                            <span className="stat-item-inline">
                              <strong>{stats.sharedLists}</strong>{" "}
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
                      <button
                        className="add-list-btn-compact-header"
                        onClick={() => handleOpenCreateList()}
                      >
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
                      ) : lists.length === 0 ? (
                        <div className="empty-state">
                          No hay listas disponibles
                        </div>
                      ) : (
                        lists.map((list) => {
                          const ListIcon = getListIcon(list);
                          const listColor = getListColor(list);
                          const listTasks = list.tasks || [];
                          const activeTasksInList = listTasks.filter(
                            (t) => !t.is_completed
                          );
                          const completedTasksInList = listTasks.filter(
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
                                      background: listColor,
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
                                        <DropdownMenuItem
                                          onClick={() => handleEditList(list)}
                                        >
                                          <Edit3 className="icon-xs" />
                                          {t("allTasks.editList")}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleShareList(list)}
                                        >
                                          <Share2 className="icon-xs" />
                                          {t("allTasks.shareList")}
                                        </DropdownMenuItem>
                                      </DropdownMenuGroup>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() =>
                                          handleDeleteListClick(list)
                                        }
                                      >
                                        <Trash2 className="icon-xs" />
                                        {t("allTasks.deleteList")}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                <div className="header-badges-row">
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
                                  <ListConfigIcons
                                    configuration={list.configuration}
                                    className="ml-1"
                                  />
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
                                {addingTaskToListId === list.id ? (
                                  <TaskCard
                                    isNew
                                    listId={list.id}
                                    hideListBadge
                                    onCreate={() => setAddingTaskToListId(null)}
                                    onEditEnd={() =>
                                      setAddingTaskToListId(null)
                                    }
                                    availableTags={list.tags || []}
                                  />
                                ) : (
                                  <button
                                    className="add-task-btn-footer"
                                    onClick={() =>
                                      setAddingTaskToListId(list.id)
                                    }
                                  >
                                    <Plus className="icon-xs" />
                                    {t("allTasks.addTask")}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}

                      {/* Add New List Card */}
                      <div
                        className="task-list-card-compact add-list-card"
                        onClick={() => handleOpenCreateList()}
                        style={{ cursor: "pointer" }}
                      >
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

        {/* Dialogs */}
        <CreateListDialog
          open={createListOpen}
          onOpenChange={(open) => {
            setCreateListOpen(open);
            if (!open) {
              setCreateListPreset({
                title: "",
                icon: "list",
                color: "#4f46e5",
              });
            }
          }}
          onCreateList={handleCreateList}
          isLoading={isCreatingList}
          initialTitle={createListPreset.title}
          initialIcon={createListPreset.icon}
          initialColor={createListPreset.color}
        />

        <EditListDialog
          open={editListOpen}
          onOpenChange={setEditListOpen}
          list={selectedListForEdit}
          onUpdateList={handleUpdateList}
          currentUserId={user?.id}
          onLeaveList={(listId) => {
            setEditListOpen(false);
          }}
        />

        <ShareListDialog
          open={shareListOpen}
          onOpenChange={setShareListOpen}
          list={selectedListForShare}
          currentUserId={user?.id}
          onListUpdated={(updates) => {
            // Actualizar is_shared localmente sin recargar desde backend
            if (selectedListForShare?.id && updates?.is_shared !== undefined) {
              updateList(selectedListForShare.id, {
                is_shared: updates.is_shared,
              });
            }
          }}
        />

        {/* Delete List Confirmation Dialog */}
        <AlertDialog open={deleteListOpen} onOpenChange={setDeleteListOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("lists.confirmDelete") || "¿Eliminar esta lista?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("lists.confirmDeleteDescription") ||
                  "Esta acción no se puede deshacer. Se eliminarán todas las tareas de esta lista."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingList}>
                {t("common.cancel") || "Cancelar"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteList}
                disabled={isDeletingList}
                className="btn-destructive"
              >
                {isDeletingList
                  ? t("common.deleting") || "Eliminando..."
                  : t("common.delete") || "Eliminar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
