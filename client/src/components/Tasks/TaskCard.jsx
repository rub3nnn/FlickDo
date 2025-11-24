import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Flag,
  MoreHorizontal,
  Link as LinkIcon,
  Unlink,
  CalendarIcon,
  Trash,
  Copy,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { useTaskEditor } from "@/hooks/useTaskEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useTasks as useTasksContext } from "@/contexts/TasksContext";
import { TagCombobox } from "./TagCombobox";
import { DateTimePicker } from "./DateTimePicker";
import { ClassroomBadge } from "./ClassroomBadge";
import { toast } from "sonner";
import {
  prepareTaskForBackend,
  prepareTaskForOptimisticUpdate,
} from "@/lib/taskUtils";

export const TaskCard = ({
  task,
  // Props opcionales para compatibilidad hacia atrás
  onToggle: externalOnToggle,
  isEditing: externalIsEditing,
  isDeleting: externalIsDeleting,
  onEditStart: externalOnEditStart,
  onEditEnd: externalOnEditEnd,
  onSave: externalOnSave,
  onDelete: externalOnDelete,
  availableTags: externalAvailableTags,
  onCreateTag: externalOnCreateTag,
  list: externalList,
  hideListBadge = false,
}) => {
  const { t, i18n } = useTranslation();
  const cardRef = useRef(null);
  const { user } = useAuth();

  // Obtener funciones y datos del contexto
  const {
    updateTask,
    deleteTask,
    toggleTaskCompleted,
    lists,
    createTag: contextCreateTag,
  } = useTasksContext();

  // Estado interno para gestión independiente
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [internalIsDeleting, setInternalIsDeleting] = useState(false);

  // Estados para animaciones y transiciones
  const [isCompleting, setIsCompleting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [undoTimeoutId, setUndoTimeoutId] = useState(null);

  // Usar estado externo si está disponible, sino usar interno
  const isEditing =
    externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const isDeleting =
    externalIsDeleting !== undefined ? externalIsDeleting : internalIsDeleting;

  // Obtener la lista y tags del contexto si no se proporcionan externamente
  const list = externalList || lists.find((l) => l.id === task.list_id);
  const availableTags = externalAvailableTags || list?.tags || [];

  // Función para obtener iniciales de un nombre
  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return `${first}${last}` || "??";
  };

  // Mapear el idioma actual a los locales de date-fns
  const getDateLocale = () => {
    return i18n.language === "es" ? es : enUS;
  };

  // Parsear la fecha inicial de forma segura
  const parseInitialDate = (dateString) => {
    if (!dateString) return undefined;
    try {
      const parsedDate = new Date(dateString);
      return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
    } catch {
      return undefined;
    }
  };

  // Formatear fecha para mostrar
  const formatDueDate = (dueDate, isAllDay) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    if (isAllDay) {
      return format(date, "PP", { locale: getDateLocale() });
    }
    return format(date, "PPp", { locale: getDateLocale() });
  };

  // Calcular días restantes
  const getDaysLeft = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = () => {
    if (!task.due_date || task.is_completed) return false;
    const now = new Date();
    const due = new Date(task.due_date);
    return due < now;
  };

  // Función para guardar cambios (compatible con uso externo e interno)
  const handleSaveTask = async (taskId, editedData) => {
    if (externalOnSave) {
      // Si hay callback externo, usarlo
      await externalOnSave(taskId, editedData);
    } else {
      // Sino, gestionar internamente
      const optimisticData = prepareTaskForOptimisticUpdate(
        editedData,
        task,
        availableTags
      );
      const backendData = prepareTaskForBackend(editedData);
      await updateTask(taskId, optimisticData, backendData);
    }

    // Llamar a onEditEnd si existe, sino usar interno
    if (externalOnEditEnd) {
      externalOnEditEnd();
    } else {
      setInternalIsEditing(false);
    }
  };

  // Usar el hook de edición de tareas
  const {
    editedTask,
    date,
    setDate,
    hasChanges,
    handleSave: handleSaveFromHook,
    handleChange,
    handleDateChange,
    handleAllDayChange,
    handleDateClear,
  } = useTaskEditor(
    task,
    isEditing,
    handleSaveTask,
    externalOnEditEnd || (() => setInternalIsEditing(false))
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target) &&
        isEditing
      ) {
        // Verificar si el click fue en un popover, select, dropdown u otro componente de Radix UI
        const isClickInPopover =
          event.target.closest('[role="dialog"]') ||
          event.target.closest("[data-radix-popper-content-wrapper]") ||
          event.target.closest('[data-slot="popover-content"]') ||
          event.target.closest('[data-slot="select-content"]') ||
          event.target.closest('[data-slot="dropdown-menu-content"]') ||
          event.target.closest('[role="listbox"]') ||
          event.target.closest('[role="menu"]') ||
          event.target.closest(".rdp") || // Calendar de react-day-picker
          event.target.closest('[data-slot="calendar"]');

        if (!isClickInPopover) {
          handleSaveFromHook();
        }
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editedTask, handleSaveFromHook]);

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (undoTimeoutId) {
        clearTimeout(undoTimeoutId);
      }
    };
  }, [undoTimeoutId]);

  const handleEditClick = (e) => {
    if (e.target.closest(".task-checkbox") || e.target.closest(".task-menu")) {
      return;
    }
    if (externalOnEditStart) {
      externalOnEditStart(task.id);
    } else {
      setInternalIsEditing(true);
    }
  };

  const handleUnlinkClassroom = () => {
    setEditedTask((prev) => ({
      ...prev,
      classroomLinked: false,
      subject: "",
      teacher: "",
    }));
  };

  const handleLinkClassroom = () => {
    // Aquí se debería abrir un modal para seleccionar una tarea de classroom
    console.log("Abrir modal para vincular tarea de classroom");
  };

  const handleDelete = async () => {
    if (externalOnDelete) {
      // Usar callback externo si existe
      externalOnDelete(task.id);
    } else {
      // Gestión interna con animación, toast y undo
      setInternalIsDeleting(true);

      // Esperar a que termine la animación de fade out (300ms)
      setTimeout(() => {
        setIsHidden(true);
        setInternalIsDeleting(false);

        let undoClicked = false;
        const TOAST_DURATION = 4000;

        const toastId = toast(t("tasks.deleted"), {
          description: task.title,
          duration: TOAST_DURATION,
          action: {
            label: t("tasks.undo"),
            onClick: () => {
              undoClicked = true;

              // Restaurar visualmente
              setIsHidden(false);

              // Limpiar el timeout si existe
              if (undoTimeoutId) {
                clearTimeout(undoTimeoutId);
                setUndoTimeoutId(null);
              }

              toast.success(t("tasks.restored") || "Tarea restaurada");
            },
          },
        });

        // Guardar el timeout para poder cancelarlo si se deshace
        const timeoutId = setTimeout(async () => {
          if (!undoClicked) {
            console.log(
              "⏱️ Tiempo expirado, eliminando tarea del backend:",
              task.id
            );

            const result = await deleteTask(task.id);
            if (result?.success) {
              toast.dismiss(toastId);
            } else {
              // Si falla, restaurar la tarea
              setIsHidden(false);
              toast.error(
                t("tasks.errorDeleting") || "Error al eliminar tarea"
              );
            }
          }
          setUndoTimeoutId(null);
        }, TOAST_DURATION);

        setUndoTimeoutId(timeoutId);
      }, 300);
    }
  };

  const handleToggle = async () => {
    if (externalOnToggle) {
      externalOnToggle(task.id);
    } else {
      // Si se está marcando como completada, mostrar animación primero
      if (!task.is_completed) {
        setIsCompleting(true);

        // Esperar 800ms para la animación de completado
        setTimeout(async () => {
          // Realizar el cambio en el backend
          const result = await toggleTaskCompleted(task.id, task.is_completed);

          if (result?.success) {
            // Esperar 400ms más para que termine la animación
            setTimeout(() => {
              setIsCompleting(false);
              // La tarea permanece visible con su nuevo estado completado
              // El contexto/padre decidirá si filtrarla o no
            }, 400);
          } else {
            // Si falla, revertir la animación
            setIsCompleting(false);
          }
        }, 800);
      } else {
        // Si se desmarca, hacerlo inmediatamente
        setIsCompleting(false);
        await toggleTaskCompleted(task.id, task.is_completed);
      }
    }
  };

  const handleCreateTag = async (name, color) => {
    if (externalOnCreateTag) {
      return await externalOnCreateTag(task.list_id, name, color);
    } else if (contextCreateTag) {
      return await contextCreateTag(task.list_id, name, color);
    }
    return { success: false, error: "No create tag function available" };
  };

  // No renderizar si está oculta
  if (isHidden) {
    return null;
  }

  if (isEditing) {
    return (
      <div
        ref={cardRef}
        className={cn(
          "task-card task-card-editing",
          isDeleting && "task-card-deleting",
          isCompleting && "task-card-completing"
        )}
      >
        <div className="task-content">
          <button onClick={handleToggle} className="task-checkbox">
            {task.is_completed ? (
              <CheckCircle2 className="icon-md checked" />
            ) : (
              <Circle className="icon-md unchecked" />
            )}
          </button>

          <div className="task-details">
            <div className="task-title-row">
              <Input
                type="text"
                value={editedTask.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="task-title-input"
                placeholder={t("tasks.taskTitle")}
                autoFocus
              />
              {isOverdue() && (
                <div className="urgent-badge">
                  <Flag className="icon-xs" />
                  <span>{t("tasks.overdue")}</span>
                </div>
              )}
            </div>

            <div className="task-meta task-meta-edit">
              {/* Badge del nombre de la lista */}
              {!hideListBadge && (
                <span className="task-badge work">
                  {list?.title || t("tasks.personalTask")}
                </span>
              )}

              {/* Badge de Classroom si está vinculada */}
              {task.classroom_integration && (
                <ClassroomBadge
                  classroomIntegration={task.classroom_integration}
                  task={task}
                />
              )}

              {/* Selector de fecha y hora */}
              <DateTimePicker
                value={editedTask.due_date}
                isAllDay={editedTask.is_all_day}
                onChange={handleDateChange}
                onAllDayChange={handleAllDayChange}
                onClear={handleDateClear}
              />

              {/* Selector de tags - ahora en la misma línea */}
              <div className="flex-1 min-w-[200px]">
                <TagCombobox
                  tags={availableTags}
                  selectedTags={editedTask.tags}
                  onTagsChange={(newTags) => handleChange("tags", newTags)}
                  onCreateTag={handleCreateTag}
                />
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="task-menu">
                <MoreHorizontal className="icon-sm" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-30" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash />
                  {t("tasks.delete")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy />
                  {t("tasks.duplicate")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "task-card",
        isDeleting && "task-card-deleting",
        isCompleting && "task-card-completing",
        task.is_completed && "task-card-completed"
      )}
    >
      <div className="task-content">
        <button onClick={handleToggle} className="task-checkbox">
          {task.is_completed ? (
            <CheckCircle2 className="icon-md checked" />
          ) : (
            <Circle className="icon-md unchecked" />
          )}
        </button>

        <div className="task-details" onClick={handleEditClick}>
          <div className="task-title-row">
            <h4 className={cn("task-title", task.is_completed && "completed")}>
              {task.title}
            </h4>
            {isOverdue() && (
              <div className="urgent-badge">
                <Flag className="icon-xs" />
                <span>{t("tasks.overdue")}</span>
              </div>
            )}
          </div>

          <div className="task-meta">
            {/* Badge del nombre de la lista */}
            {!hideListBadge && (
              <span className="task-badge work">
                {list?.title || t("tasks.personalTask")}
              </span>
            )}

            {/* Badge de Classroom si está vinculada */}
            {task.classroom_integration && (
              <ClassroomBadge
                classroomIntegration={task.classroom_integration}
                task={task}
              />
            )}

            {task.due_date && (
              <div className="task-due">
                <Clock className="icon-xs" />
                <span>{formatDueDate(task.due_date, task.is_all_day)}</span>
              </div>
            )}

            {/* Mostrar tags si existen */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap items-center">
                {task.tags.map((tag) => (
                  <span
                    key={`tag-${task.id}-${tag.id}`}
                    className="text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 shrink-0"
                    style={{
                      backgroundColor: tag.color + "20",
                      color: tag.color,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span>{tag.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Mostrar assignees si existen */}
          {task.assignees && task.assignees.length > 0 && (
            <div className="task-assignees">
              <div className="task-assignees-stack">
                {task.assignees.slice(0, 12).map((assignee) => (
                  <Tooltip key={`assignee-${task.id}-${assignee.id}`}>
                    <TooltipTrigger asChild>
                      <Avatar
                        data-slot="avatar"
                        className="h-8 w-8 border-2 border-background"
                      >
                        <AvatarImage
                          src={assignee.avatar_url}
                          alt={`${assignee.first_name} ${assignee.last_name}`}
                        />
                        <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                          {getInitials(assignee.first_name, assignee.last_name)}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {assignee.id === user?.id
                          ? t("tasks.you")
                          : `${assignee.first_name} ${assignee.last_name}`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {task.assignees.length > 3 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Avatar
                        data-slot="avatar"
                        className="task-assignees-more h-8 w-8 border-2 border-background"
                      >
                        <AvatarFallback className="text-xs font-semibold">
                          +{task.assignees.length - 3}
                        </AvatarFallback>
                      </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="w-64" align="start">
                      <div className="task-assignees-list">
                        <p className="task-assignees-list-title">
                          {t("tasks.assignedTo")}
                        </p>
                        {task.assignees.map((assignee) => (
                          <div
                            key={`assignee-popover-${task.id}-${assignee.id}`}
                            className="task-assignees-list-item"
                          >
                            <Avatar
                              data-slot="avatar"
                              className="task-assignees-list-avatar h-8 w-8"
                            >
                              <AvatarImage
                                src={assignee.avatar_url}
                                alt={`${assignee.first_name} ${assignee.last_name}`}
                              />
                              <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                                {getInitials(
                                  assignee.first_name,
                                  assignee.last_name
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <span className="task-assignees-list-name">
                              {assignee.id === user?.id
                                ? t("tasks.you")
                                : `${assignee.first_name} ${assignee.last_name}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="task-menu">
              <MoreHorizontal className="icon-sm" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-30" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Users />
                {t("tasks.asigntask")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete}>
                <Trash />
                {t("tasks.delete")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
