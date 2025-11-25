import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { TaskCard } from "./components/Tasks/TaskCard";
import { EditListDialog } from "./components/Lists/EditListDialog";
import { ShareListDialog } from "./components/Lists/ShareListDialog";
import { useTranslation } from "react-i18next";
import { useTasks } from "./contexts/TasksContext";
import { useAuth } from "./hooks/useAuth";
import { toast } from "sonner";
import { tagsApi } from "@/services/api";
import {
  prepareTaskForBackend,
  prepareTaskForOptimisticUpdate,
} from "@/lib/taskUtils";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Users,
  Lock,
  Circle,
  CheckCircle2,
  Trash2,
  Share2,
  Edit3,
  List,
  Star,
  Briefcase,
  Home,
  Heart,
  BookOpen,
  ShoppingCart,
  Plane,
  Music,
  Camera,
  Coffee,
  Gamepad2,
  Palette,
  Dumbbell,
  Gift,
  Lightbulb,
  Code,
  Calendar,
  Tag,
  Zap,
  Target,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";

// Mapeo de iconos por nombre
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

export default function ListPage() {
  const { t } = useTranslation();
  const { listId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Obtener listas del contexto global
  const {
    lists,
    loading,
    error,
    updateTask,
    deleteTask: contextDeleteTask,
    createTask,
    updateList,
    deleteList,
  } = useTasks();

  // Encontrar la lista actual
  const list = useMemo(() => {
    return lists.find((l) => String(l.id) === String(listId));
  }, [lists, listId]);

  // Estados para los dialogs
  const [editListOpen, setEditListOpen] = useState(false);
  const [shareListOpen, setShareListOpen] = useState(false);
  const [deleteListOpen, setDeleteListOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados para tareas
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [hiddenTaskIds, setHiddenTaskIds] = useState(new Set());
  const [showNewTaskCard, setShowNewTaskCard] = useState(false);

  // Tags disponibles para la lista
  const availableTags = useMemo(() => {
    return list?.tags || [];
  }, [list]);

  // Tareas de la lista
  const listTasks = useMemo(() => {
    return list?.tasks || [];
  }, [list]);

  // Tareas filtradas
  const activeTasks = useMemo(() => {
    return listTasks.filter(
      (task) => !task.is_completed && !hiddenTaskIds.has(task.id)
    );
  }, [listTasks, hiddenTaskIds]);

  const completedTasks = useMemo(() => {
    return listTasks.filter(
      (task) => task.is_completed && !hiddenTaskIds.has(task.id)
    );
  }, [listTasks, hiddenTaskIds]);

  // Obtener icono y color de la lista
  const getListIcon = (list) => {
    const iconName = list?.icon || "list";
    return ICON_MAP[iconName] || List;
  };

  const getListColor = (list) => {
    return list?.color || "#3B82F6";
  };

  const ListIcon = getListIcon(list);
  const listColor = getListColor(list);

  // Handlers
  const handleEditList = () => {
    setEditListOpen(true);
  };

  const handleShareList = () => {
    setShareListOpen(true);
  };

  const handleDeleteList = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteList(listId);
      if (result?.success) {
        toast.success(t("lists.deleted") || "Lista eliminada");
        navigate("/all-tasks");
      } else {
        toast.error(t("lists.errorDeleting") || "Error al eliminar la lista");
      }
    } catch (err) {
      toast.error(t("lists.errorDeleting") || "Error al eliminar la lista");
    } finally {
      setIsDeleting(false);
      setDeleteListOpen(false);
    }
  };

  const handleUpdateList = async (id, data) => {
    try {
      const result = await updateList(id, data);
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Handlers de tareas
  const handleEditStart = (taskId) => {
    setEditingTaskId(taskId);
  };

  const handleEditEnd = () => {
    setEditingTaskId(null);
  };

  const handleSaveTask = async (taskId, editedData) => {
    const originalTask = listTasks.find((t) => t.id === taskId);
    if (!originalTask) return;

    const optimisticData = prepareTaskForOptimisticUpdate(
      editedData,
      originalTask,
      availableTags
    );
    const backendData = prepareTaskForBackend(editedData);

    if (updateTask) {
      await updateTask(taskId, optimisticData, backendData);
    }
    handleEditEnd();
  };

  const handleDeleteTask = async (taskId) => {
    const taskToDelete = listTasks.find((t) => t.id === taskId);
    if (!taskToDelete) return;

    setDeletingTaskId(taskId);

    setTimeout(() => {
      setHiddenTaskIds((prev) => new Set(prev).add(taskId));
      setDeletingTaskId(null);

      let undoClicked = false;
      const TOAST_DURATION = 4000;

      const toastId = toast(t("tasks.deleted"), {
        description: taskToDelete.title,
        duration: TOAST_DURATION,
        action: {
          label: t("tasks.undo"),
          onClick: () => {
            undoClicked = true;
            setHiddenTaskIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(taskId);
              return newSet;
            });
            toast.success(t("tasks.restored") || "Tarea restaurada");
          },
        },
      });

      setTimeout(async () => {
        if (!undoClicked) {
          try {
            const result = await contextDeleteTask(taskId);
            if (result?.success) {
              toast.dismiss(toastId);
              setHiddenTaskIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(taskId);
                return newSet;
              });
            } else {
              toast.dismiss(toastId);
              setHiddenTaskIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(taskId);
                return newSet;
              });
              toast.error(
                t("tasks.errorDeleting") || "Error al eliminar la tarea"
              );
            }
          } catch (error) {
            toast.dismiss(toastId);
            setHiddenTaskIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(taskId);
              return newSet;
            });
            toast.error(
              t("tasks.errorDeleting") || "Error al eliminar la tarea"
            );
          }
        }
      }, TOAST_DURATION);
    }, 300);
  };

  const handleCreateTag = async (name, color = "#3B82F6") => {
    try {
      const response = await tagsApi.createTag(listId, name, color);
      if (response.success) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error("Error creando tag:", error);
      return { success: false, error: error.message };
    }
  };

  const handleNewTaskCreated = () => {
    setShowNewTaskCard(false);
  };

  // Si está cargando, mostrar skeleton
  if (loading) {
    return (
      <div className="dashboard-container">
        <main className="main-content">
          <Header />
          <div className="content-area">
            <div className="content-wrapper" style={{ padding: "24px" }}>
              <div className="list-page-loading">
                <div className="skeleton skeleton-header"></div>
                <div className="skeleton skeleton-task"></div>
                <div className="skeleton skeleton-task"></div>
                <div className="skeleton skeleton-task"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Si no se encuentra la lista (después de cargar)
  if (!list) {
    return (
      <div className="dashboard-container">
        <main className="main-content">
          <Header />
          <div className="content-area">
            <div className="content-wrapper" style={{ padding: "24px" }}>
              <div className="list-not-found">
                <div className="list-not-found-icon">
                  <AlertCircle className="icon-xl" />
                </div>
                <h2>{t("lists.notFound") || "Lista no encontrada"}</h2>
                <p>
                  {t("lists.notFoundDescription") ||
                    "La lista que buscas no existe o no tienes acceso a ella."}
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/all-tasks">
                    <ArrowLeft className="icon-sm mr-2" />
                    {t("common.backToTasks") || "Volver a mis tareas"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <Header />

        <div className="content-area">
          <div className="content-wrapper" style={{ padding: "24px" }}>
            <div className="list-page-container">
              {/* Header de la lista */}
              <div className="list-page-header">
                <div className="list-page-header-left">
                  <div
                    className="list-page-icon"
                    style={{ background: listColor }}
                  >
                    <ListIcon className="icon-md" />
                  </div>

                  <div className="list-page-info">
                    <h1 className="list-page-title">{list.title}</h1>
                    <div className="list-page-meta">
                      {list.is_shared ? (
                        <span className="list-meta-badge shared">
                          <Users className="icon-xs" />
                          {t("allTasks.shared") || "Compartida"}
                        </span>
                      ) : (
                        <span className="list-meta-badge private">
                          <Lock className="icon-xs" />
                          {t("allTasks.private") || "Privada"}
                        </span>
                      )}
                      <span className="list-meta-count">
                        {activeTasks.length}{" "}
                        {activeTasks.length === 1
                          ? t("tasks.task") || "tarea"
                          : t("tasks.tasks") || "tareas"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="list-page-header-right">
                  <button
                    className="list-page-action-btn"
                    onClick={handleShareList}
                    title={t("allTasks.shareList") || "Compartir lista"}
                  >
                    <Share2 className="icon-sm" />
                  </button>
                  <button
                    className="list-page-action-btn"
                    onClick={handleEditList}
                    title={t("allTasks.editList") || "Editar lista"}
                  >
                    <Edit3 className="icon-sm" />
                  </button>
                  <button
                    className="list-page-action-btn destructive"
                    onClick={() => setDeleteListOpen(true)}
                    title={t("allTasks.deleteList") || "Eliminar lista"}
                  >
                    <Trash2 className="icon-sm" />
                  </button>
                </div>
              </div>

              {/* Contenido de tareas */}
              <div className="list-page-content">
                {/* Botón/TaskCard para añadir tarea */}
                <div className="add-task-section">
                  {showNewTaskCard ? (
                    <TaskCard
                      isNew
                      listId={listId}
                      hideListBadge
                      onCreate={handleNewTaskCreated}
                      onEditEnd={() => setShowNewTaskCard(false)}
                      availableTags={availableTags}
                      onCreateTag={handleCreateTag}
                    />
                  ) : (
                    <button
                      className="add-task-button"
                      onClick={() => setShowNewTaskCard(true)}
                    >
                      <Plus className="icon-sm" />
                      {t("allTasks.addTask") || "Añadir tarea"}
                    </button>
                  )}
                </div>

                {/* Lista de tareas activas */}
                {activeTasks.length > 0 ? (
                  <div className="tasks-list-page">
                    {activeTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        isEditing={editingTaskId === task.id}
                        isDeleting={deletingTaskId === task.id}
                        onEditStart={handleEditStart}
                        onEditEnd={handleEditEnd}
                        onSave={handleSaveTask}
                        onDelete={handleDeleteTask}
                        availableTags={availableTags}
                        onCreateTag={handleCreateTag}
                        list={list}
                        hideListBadge={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="list-empty-state">
                    <Circle className="icon-lg" />
                    <p>
                      {t("allTasks.emptyList") || "No hay tareas en esta lista"}
                    </p>
                  </div>
                )}

                {/* Sección de tareas completadas */}
                {completedTasks.length > 0 && (
                  <div className="completed-section">
                    <button
                      className="completed-toggle"
                      onClick={() => setShowCompleted(!showCompleted)}
                    >
                      {showCompleted ? (
                        <ChevronDown className="icon-sm" />
                      ) : (
                        <ChevronRight className="icon-sm" />
                      )}
                      <CheckCircle2 className="icon-sm completed-icon" />
                      <span>
                        {completedTasks.length}{" "}
                        {t("allTasks.stats.completed") || "completadas"}
                      </span>
                    </button>

                    {showCompleted && (
                      <div className="tasks-list-page completed">
                        {completedTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            isEditing={editingTaskId === task.id}
                            isDeleting={deletingTaskId === task.id}
                            onEditStart={handleEditStart}
                            onEditEnd={handleEditEnd}
                            onSave={handleSaveTask}
                            onDelete={handleDeleteTask}
                            availableTags={availableTags}
                            onCreateTag={handleCreateTag}
                            list={list}
                            hideListBadge={true}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <EditListDialog
          open={editListOpen}
          onOpenChange={setEditListOpen}
          list={list}
          onUpdateList={handleUpdateList}
        />

        <ShareListDialog
          open={shareListOpen}
          onOpenChange={setShareListOpen}
          list={list}
          currentUserId={user?.id}
        />

        {/* Confirm Delete Dialog */}
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
              <AlertDialogCancel disabled={isDeleting}>
                {t("common.cancel") || "Cancelar"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteList}
                disabled={isDeleting}
                className="btn-destructive"
              >
                {isDeleting
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
