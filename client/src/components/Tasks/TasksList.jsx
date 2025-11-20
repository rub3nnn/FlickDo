import React from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { FilterButton } from "./FilterButton";

export const TasksList = ({ tasks, filter, onFilterChange, onToggleTask }) => {
  const { t } = useTranslation();
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.type === filter;
  });

  const filterOptions = [
    {
      id: "all",
      label: t("tasks.all"),
      count: tasks.filter((t) => t.status !== "completed").length,
    },
    {
      id: "work",
      label: t("tasks.work"),
      count: tasks.filter((t) => t.type === "work" && t.status !== "completed")
        .length,
    },
    {
      id: "classroom",
      label: t("tasks.classroom"),
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
            <h2 className="section-title">{t("tasks.myTasks")}</h2>
            <span className="title-badge">
              {filteredTasks.filter((t) => t.status !== "completed").length}
            </span>
          </div>
          <button className="add-task-button">
            <Plus className="icon-sm" />
            {t("tasks.newTask")}
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
