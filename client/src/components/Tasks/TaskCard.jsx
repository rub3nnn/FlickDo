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
} from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { TagCombobox } from "./TagCombobox";
import { DateTimePicker } from "./DateTimePicker";
import { ClassroomBadge } from "./ClassroomBadge";

export const TaskCard = ({
  task,
  onToggle,
  isEditing,
  isDeleting,
  onEditStart,
  onEditEnd,
  onSave,
  onDelete,
  availableTags = [], // Tags disponibles de la lista (para evitar múltiples peticiones)
  onCreateTag, // Función para crear un nuevo tag
  list, // La lista específica a la que pertenece esta tarea
}) => {
  const { t, i18n } = useTranslation();
  const cardRef = useRef(null);
  const { user } = useAuth();

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

  const [date, setDate] = useState(parseInitialDate(task.due_date));
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description || "",
    due_date: task.due_date || "",
    is_all_day: task.is_all_day || false,
    assignees: task.assignees?.map((a) => a.id) || [],
    tags: task.tags?.map((t) => t.id) || [],
  });

  // Sincronizar el estado editado cuando cambian las props de la tarea
  useEffect(() => {
    if (!isEditing) {
      setEditedTask({
        title: task.title,
        description: task.description || "",
        due_date: task.due_date || "",
        is_all_day: task.is_all_day || false,
        assignees: task.assignees?.map((a) => a.id) || [],
        tags: task.tags?.map((t) => t.id) || [],
      });
      setDate(parseInitialDate(task.due_date));
    }
  }, [task, isEditing]);

  // Función para comparar si los datos han cambiado
  const hasChanges = () => {
    const originalTags = task.tags?.map((t) => t.id) || [];
    const editedTags = editedTask.tags || [];
    const originalAssignees = task.assignees?.map((a) => a.id) || [];
    const editedAssignees = editedTask.assignees || [];

    // Comparar arrays de tags
    const tagsChanged =
      originalTags.length !== editedTags.length ||
      !originalTags.every((tag) => editedTags.includes(tag));

    // Comparar arrays de assignees
    const assigneesChanged =
      originalAssignees.length !== editedAssignees.length ||
      !originalAssignees.every((assignee) =>
        editedAssignees.includes(assignee)
      );

    return (
      task.title !== editedTask.title ||
      (task.description || "") !== editedTask.description ||
      (task.due_date || "") !== editedTask.due_date ||
      (task.is_all_day || false) !== editedTask.is_all_day ||
      assigneesChanged ||
      tagsChanged
    );
  };

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
          handleSave();
        }
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editedTask]);

  const handleEditClick = (e) => {
    if (e.target.closest(".task-checkbox") || e.target.closest(".task-menu")) {
      return;
    }
    onEditStart(task.id);
  };

  const handleSave = () => {
    // Verificar si hay cambios antes de guardar
    if (!hasChanges()) {
      console.log("✅ No hay cambios en la tarea, no se actualiza");
      onEditEnd();
      return;
    }

    // Guardar los cambios
    console.log("💾 Guardando cambios:", editedTask);
    if (onSave) {
      onSave(task.id, editedTask);
    }
    onEditEnd();
  };

  const handleChange = (field, value) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (newDate) => {
    handleChange("due_date", newDate);
  };

  const handleAllDayChange = (newAllDay) => {
    handleChange("is_all_day", newAllDay);
  };

  const handleDateClear = () => {
    handleChange("due_date", null);
    setDate(undefined);
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

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
    }
  };

  if (isEditing) {
    return (
      <div
        ref={cardRef}
        className={cn(
          "task-card task-card-editing",
          isDeleting && "task-card-deleting"
        )}
      >
        <div className="task-content">
          <button onClick={() => onToggle(task.id)} className="task-checkbox">
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
              <span className="task-badge work">
                {list?.title || t("tasks.personalTask")}
              </span>

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
                  onCreateTag={onCreateTag}
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
    <div className={cn("task-card", isDeleting && "task-card-deleting")}>
      <div className="task-content">
        <button onClick={() => onToggle(task.id)} className="task-checkbox">
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
            <span className="task-badge work">
              {list?.title || t("tasks.personalTask")}
            </span>

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
                    key={tag.id}
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
                {task.assignees.slice(0, 3).map((assignee) => (
                  <Tooltip key={assignee.id}>
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
                            key={assignee.id}
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
};
