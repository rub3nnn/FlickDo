import React from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Flag,
  MoreHorizontal,
} from "lucide-react";

export const TaskCard = ({ task, onToggle }) => {
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

        <div className="task-details">
          <div className="task-title-row">
            <h4
              className={`task-title ${
                task.status === "completed" ? "completed" : ""
              }`}
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
