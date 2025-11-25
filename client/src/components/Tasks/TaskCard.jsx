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
import { AssignTaskCommand } from "./AssignTaskCommand";
import { toast } from "sonner";
import {
  prepareTaskForBackend,
  prepareTaskForOptimisticUpdate,
} from "@/lib/taskUtils";

export const TaskCard = ({
  task,
  // Props para modo creación de nueva tarea
  isNew = false,
  onCreate,
  listId: propListId,
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
  const titleInputRef = useRef(null);
  const { user } = useAuth();

  // Obtener funciones y datos del contexto
  const {
    updateTask,
    deleteTask,
    toggleTaskCompleted,
    createTask,
    lists,
    createTag: contextCreateTag,
  } = useTasksContext();

  // Tarea vacía para modo creación
  const emptyTask = {
    id: "new",
    title: "",
    description: "",
    is_completed: false,
    due_date: null,
    is_all_day: false,
    tags: [],
    assignees: [],
    list_id: propListId,
  };

  // Usar tarea vacía si es modo creación
  const currentTask = isNew ? emptyTask : task;

  // Estado interno para gestión independiente
  const [internalIsEditing, setInternalIsEditing] = useState(isNew);
  const [internalIsDeleting, setInternalIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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
  const list =
    externalList ||
    lists.find((l) => l.id === (currentTask?.list_id || propListId));
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
    if (!currentTask?.due_date || currentTask?.is_completed) return false;
    const now = new Date();
    const due = new Date(currentTask.due_date);
    return due < now;
  };

  // Función para guardar cambios (compatible con uso externo e interno)
  const handleSaveTask = async (taskId, editedData) => {
    // Modo creación de nueva tarea
    if (isNew) {
      // No crear si no hay título
      if (!editedData.title?.trim()) {
        return;
      }

      setIsCreating(true);
      try {
        const taskData = {
          title: editedData.title.trim(),
        };

        // Solo añadir campos opcionales si tienen valor
        if (editedData.description) {
          taskData.description = editedData.description;
        }
        if (editedData.due_date) {
          taskData.due_date = editedData.due_date;
          taskData.is_all_day = editedData.is_all_day || false;
        }
        if (editedData.tags?.length > 0) {
          taskData.tags = editedData.tags.map((t) =>
            typeof t === "object" ? t.id : t
          );
        }
        if (editedData.assignees?.length > 0) {
          taskData.assignees = editedData.assignees.map((a) =>
            typeof a === "object" ? a.id : a
          );
        }

        // Usar createTask del contexto (asegurar que listId sea número)
        const result = await createTask(Number(propListId), taskData);
        if (result?.success) {
          // Cerrar el TaskCard de creación
          if (externalOnEditEnd) {
            externalOnEditEnd();
          } else {
            setInternalIsEditing(false);
          }
          // Llamar a onCreate si existe
          if (onCreate) {
            onCreate();
          }
        } else {
          toast.error(t("tasks.errorCreating") || "Error al crear la tarea");
        }
      } catch (error) {
        console.error("Error creando tarea:", error);
        toast.error(t("tasks.errorCreating") || "Error al crear la tarea");
      } finally {
        setIsCreating(false);
      }
      return;
    }

    // Cerrar modo edición inmediatamente (antes de esperar la respuesta del backend)
    if (externalOnEditEnd) {
      externalOnEditEnd();
    } else {
      setInternalIsEditing(false);
    }

    // Modo edición normal - procesar en segundo plano
    if (externalOnSave) {
      // Si hay callback externo, usarlo (sin await para no bloquear)
      externalOnSave(taskId, editedData);
    } else {
      // Sino, gestionar internamente
      const optimisticData = prepareTaskForOptimisticUpdate(
        editedData,
        currentTask,
        availableTags
      );
      const backendData = prepareTaskForBackend(editedData);
      // No usar await - la actualización optimista ya muestra el cambio
      updateTask(taskId, optimisticData, backendData);
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
    currentTask,
    isEditing,
    handleSaveTask,
    externalOnEditEnd || (() => setInternalIsEditing(false)),
    isNew
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
      externalOnEditStart(currentTask.id);
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
    // No permitir eliminar en modo creación
    if (isNew) return;

    if (externalOnDelete) {
      // Usar callback externo si existe
      externalOnDelete(currentTask.id);
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
          description: currentTask.title,
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
              currentTask.id
            );

            const result = await deleteTask(currentTask.id);
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
    // No permitir toggle en modo creación
    if (isNew) return;

    if (externalOnToggle) {
      externalOnToggle(currentTask.id);
    } else {
      // Si se está marcando como completada, mostrar animación primero
      if (!currentTask.is_completed) {
        setIsCompleting(true);

        // Esperar 800ms para la animación de completado
        setTimeout(async () => {
          // Realizar el cambio en el backend
          const result = await toggleTaskCompleted(
            currentTask.id,
            currentTask.is_completed
          );

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
        await toggleTaskCompleted(currentTask.id, currentTask.is_completed);
      }
    }
  };

  const handleCreateTag = async (name, color) => {
    const taskListId = currentTask?.list_id || propListId;
    if (externalOnCreateTag) {
      return await externalOnCreateTag(taskListId, name, color);
    } else if (contextCreateTag) {
      return await contextCreateTag(taskListId, name, color);
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
          isNew && "task-card-new",
          isDeleting && "task-card-deleting",
          isCompleting && "task-card-completing"
        )}
      >
        <div className="task-content">
          <button
            onClick={handleToggle}
            className="task-checkbox"
            disabled={isNew}
          >
            {currentTask.is_completed ? (
              <CheckCircle2 className="icon-md checked" />
            ) : (
              <Circle className="icon-md unchecked" />
            )}
          </button>

          <div className="task-details">
            <div className="task-title-row mb-0!">
              <Input
                ref={titleInputRef}
                type="text"
                value={editedTask.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="task-title-input"
                placeholder={
                  isNew
                    ? t("tasks.newTaskPlaceholder") || "¿Qué necesitas hacer?"
                    : t("tasks.taskTitle")
                }
                autoFocus
              />
              {!isNew && isOverdue() && (
                <div className="urgent-badge">
                  <Flag className="icon-xs" />
                  <span>{t("tasks.overdue")}</span>
                </div>
              )}
            </div>

            {/* Descripción de la tarea */}
            <input
              type="text"
              value={editedTask.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1 mt-1 border border-transparent focus:border-muted-foreground/20 outline-none placeholder:text-muted-foreground/40 transition-colors mb-2"
              placeholder={
                t("tasks.descriptionPlaceholder") || "Añadir descripción..."
              }
            />

            <div className="task-meta task-meta-edit">
              {/* Badge del nombre de la lista */}
              {!hideListBadge && (
                <span className="task-badge work">
                  {list?.title || t("tasks.personalTask")}
                </span>
              )}

              {/* Badge de Classroom si está vinculada */}
              {currentTask.classroom_integration && (
                <ClassroomBadge
                  classroomIntegration={currentTask.classroom_integration}
                  task={currentTask}
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

              {/* Selector de asignados */}
              <AssignTaskCommand
                listId={currentTask.list_id || propListId}
                assignedUsers={editedTask.assignees}
                onAssigneeChange={(newAssignees) => {
                  const assigneeIds = newAssignees.map((a) =>
                    typeof a === "object" ? a.id : a
                  );
                  handleChange("assignees", assigneeIds);
                }}
                currentUserId={user?.id}
              />
            </div>
          </div>

          {/* Solo mostrar menú si no es modo creación */}
          {!isNew && (
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
          )}
        </div>
      </div>
    );
  }

  // No renderizar vista normal en modo creación (siempre está en modo edición)
  if (isNew) {
    return null;
  }

  return (
    <div
      className={cn(
        "task-card",
        isDeleting && "task-card-deleting",
        isCompleting && "task-card-completing",
        currentTask.is_completed && "task-card-completed",
        currentTask._isNew && "task-new"
      )}
    >
      <div className="task-content">
        <button onClick={handleToggle} className="task-checkbox">
          {currentTask.is_completed ? (
            <CheckCircle2 className="icon-md checked" />
          ) : (
            <Circle className="icon-md unchecked" />
          )}
        </button>

        <div className="task-details" onClick={handleEditClick}>
          <div
            className={cn("task-title-row", currentTask.description && "mb-0!")}
          >
            <h4
              className={cn(
                "task-title",
                currentTask.is_completed && "completed"
              )}
            >
              {currentTask.title}
            </h4>
            {isOverdue() && (
              <div className="urgent-badge">
                <Flag className="icon-xs" />
                <span>{t("tasks.overdue")}</span>
              </div>
            )}
          </div>

          {/* Descripción de la tarea */}
          {currentTask.description && (
            <p className="text-xs text-muted-foreground/70 line-clamp-1 mb-2">
              {currentTask.description}
            </p>
          )}

          <div className="task-meta">
            {/* Badge del nombre de la lista */}
            {!hideListBadge && (
              <span className="task-badge work">
                {list?.title || t("tasks.personalTask")}
              </span>
            )}

            {/* Badge de Classroom si está vinculada */}
            {currentTask.classroom_integration && (
              <ClassroomBadge
                classroomIntegration={currentTask.classroom_integration}
                task={currentTask}
              />
            )}

            {currentTask.due_date && (
              <div className="task-due">
                <Clock className="icon-xs" />
                <span>
                  {formatDueDate(currentTask.due_date, currentTask.is_all_day)}
                </span>
              </div>
            )}

            {/* Mostrar tags si existen */}
            {currentTask.tags && currentTask.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap items-center">
                {currentTask.tags.map((tag) => (
                  <span
                    key={`tag-${currentTask.id}-${tag.id}`}
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
          {currentTask.assignees && currentTask.assignees.length > 0 && (
            <div className="task-assignees">
              <div className="task-assignees-stack">
                {currentTask.assignees.slice(0, 12).map((assignee) => (
                  <Tooltip key={`assignee-${currentTask.id}-${assignee.id}`}>
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
                {currentTask.assignees.length > 3 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Avatar
                        data-slot="avatar"
                        className="task-assignees-more h-8 w-8 border-2 border-background"
                      >
                        <AvatarFallback className="text-xs font-semibold">
                          +{currentTask.assignees.length - 3}
                        </AvatarFallback>
                      </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="w-64" align="start">
                      <div className="task-assignees-list">
                        <p className="task-assignees-list-title">
                          {t("tasks.assignedTo")}
                        </p>
                        {currentTask.assignees.map((assignee) => (
                          <div
                            key={`assignee-popover-${currentTask.id}-${assignee.id}`}
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
              <DropdownMenuItem onClick={handleEditClick}>
                <Users />
                {t("assign.assignTask")}
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
