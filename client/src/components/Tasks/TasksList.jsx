import React from "react";
import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { FilterButton } from "./FilterButton";

export const TasksList = ({ tasks, filter, onFilterChange, onToggleTask }) => {
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.type === filter;
  });

  const filterOptions = [
    {
      id: "all",
      label: "Todas",
      count: tasks.filter((t) => t.status !== "completed").length,
    },
    {
      id: "work",
      label: "Trabajo",
      count: tasks.filter((t) => t.type === "work" && t.status !== "completed")
        .length,
    },
    {
      id: "classroom",
      label: "Classroom",
      count: tasks.filter(
        (t) => t.type === "classroom" && t.status !== "completed"
      ).length,
    },
  ];

  return (
    <div className="tasks-column">
      <div className="tasks-header">
        <div className="tasks-title-wrapper">
          <div className="tasks-title-group">
            <h2 className="section-title">Mis Tareas</h2>
            <span className="title-badge">
              {filteredTasks.filter((t) => t.status !== "completed").length}
            </span>
          </div>
          <button className="add-task-button">
            <Plus className="icon-sm" />
            Nueva tarea
          </button>
        </div>

        <div className="filter-buttons">
          {filterOptions.map((f) => (
            <FilterButton
              key={f.id}
              id={f.id}
              label={f.label}
              count={f.count}
              active={filter === f.id}
              onClick={onFilterChange}
            />
          ))}
        </div>
      </div>

      <div className="tasks-list">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={onToggleTask} />
        ))}
      </div>
    </div>
  );
};
