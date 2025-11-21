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
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const TaskCard = ({
  task,
  onToggle,
  isEditing,
  onEditStart,
  onEditEnd,
  onSave,
}) => {
  const cardRef = useRef(null);

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

  const [date, setDate] = useState(parseInitialDate(task.dueDate));
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    subject: task.subject || "",
    teacher: task.teacher || "",
    project: task.project || "",
    dueDate: task.dueDate || "",
    dueTime: task.dueTime || "",
    priority: task.priority,
    progress: task.progress || 0,
    classroomLinked: task.classroomLinked || false,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target) &&
        isEditing
      ) {
        // Verificar si el click fue en un popover, select u otro componente de Radix UI
        const isClickInPopover =
          event.target.closest('[role="dialog"]') ||
          event.target.closest("[data-radix-popper-content-wrapper]") ||
          event.target.closest('[data-slot="popover-content"]') ||
          event.target.closest('[data-slot="select-content"]') ||
          event.target.closest('[role="listbox"]') ||
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
    // Aquí se debería llamar a una función para guardar los cambios
    console.log("Guardando cambios:", editedTask);
    if (onSave) {
      onSave(task.id, editedTask);
    }
    onEditEnd();
  };

  const handleChange = (field, value) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      handleChange("dueDate", formattedDate);
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

  if (isEditing) {
    return (
      <div ref={cardRef} className="task-card task-card-editing">
        <div className="task-content">
          <button onClick={() => onToggle(task.id)} className="task-checkbox">
            {task.status === "completed" ? (
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
                placeholder="Título de la tarea"
                autoFocus
              />
              {editedTask.priority === "high" &&
                task.status !== "completed" && (
                  <div className="urgent-badge">
                    <Flag className="icon-xs" />
                    <span>URGENTE</span>
                  </div>
                )}
            </div>

            <div className="task-meta task-meta-edit">
              {editedTask.classroomLinked ? (
                <>
                  <span className="task-badge classroom">
                    {editedTask.subject}
                  </span>
                  <span className="task-teacher">{editedTask.teacher}</span>
                  <button
                    onClick={handleUnlinkClassroom}
                    className="task-link-btn"
                    title="Desvincular de classroom"
                  >
                    <Unlink className="icon-xs" />
                  </button>
                </>
              ) : task.type === "classroom" ? (
                <>
                  <button
                    onClick={handleLinkClassroom}
                    className="task-link-btn link"
                    title="Vincular a tarea de classroom"
                  >
                    <LinkIcon className="icon-xs" />
                    <span>Vincular a classroom</span>
                  </button>
                </>
              ) : (
                <Input
                  type="text"
                  value={editedTask.project}
                  onChange={(e) => handleChange("project", e.target.value)}
                  className="task-badge-input work"
                  placeholder="Proyecto"
                />
              )}

              <div className="task-due-edit">
                <Clock className="icon-xs" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "task-date-input justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                      size="sm"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  value={editedTask.dueTime}
                  onChange={(e) => handleChange("dueTime", e.target.value)}
                  className="task-time-input"
                />
              </div>

              <Select
                value={editedTask.priority}
                onValueChange={(value) => handleChange("priority", value)}
              >
                <SelectTrigger className="task-priority-select" size="sm">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {task.status === "in-progress" && (
              <div className="progress-wrapper-edit">
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${editedTask.progress}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editedTask.progress}
                    onChange={(e) =>
                      handleChange("progress", parseInt(e.target.value))
                    }
                    className="task-progress-slider"
                  />
                </div>
                <span className="progress-text">{editedTask.progress}%</span>
              </div>
            )}
          </div>

          <button className="task-menu">
            <MoreHorizontal className="icon-sm" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-card">
      <div className="task-content">
        <button onClick={() => onToggle(task.id)} className="task-checkbox">
          {task.status === "completed" ? (
            <CheckCircle2 className="icon-md checked" />
          ) : (
            <Circle className="icon-md unchecked" />
          )}
        </button>

        <div className="task-details" onClick={handleEditClick}>
          <div className="task-title-row">
            <h4
              className={cn(
                "task-title",
                task.status === "completed" && "completed"
              )}
            >
              {task.title}
            </h4>
            {task.priority === "high" && task.status !== "completed" && (
              <div className="urgent-badge">
                <Flag className="icon-xs" />
                <span>URGENTE</span>
              </div>
            )}
          </div>

          <div className="task-meta">
            {task.type === "classroom" ? (
              <>
                <span className="task-badge classroom">{task.subject}</span>
                <span className="task-teacher">{task.teacher}</span>
              </>
            ) : (
              <span className="task-badge work">{task.project}</span>
            )}
            <div className="task-due">
              <Clock className="icon-xs" />
              <span>{task.dueDate}</span>
            </div>
          </div>

          {task.status === "in-progress" && (
            <div className="progress-wrapper">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <span className="progress-text">{task.progress}%</span>
            </div>
          )}
        </div>

        <button className="task-menu">
          <MoreHorizontal className="icon-sm" />
        </button>
      </div>
    </div>
  );
};
