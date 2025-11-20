import React from "react";
import { GraduationCap, ExternalLink } from "lucide-react";

export const ClassroomWidget = ({ classroomTasks }) => {
  return (
    <div className="widget classroom-widget">
      <div className="widget-header">
        <div className="widget-title-group">
          <div className="classroom-icon">
            <GraduationCap className="icon-sm" />
          </div>
          <h3 className="widget-title">Classroom</h3>
        </div>
        <span className="classroom-badge">{classroomTasks.length}</span>
      </div>
      <div className="classroom-list">
        {classroomTasks.slice(0, 4).map((task) => (
          <div key={task.id} className="classroom-card">
            <p className="classroom-task-title">{task.title}</p>
            <div className="classroom-task-footer">
              <span className="classroom-subject">{task.subject}</span>
              <span
                className={`classroom-days ${
                  task.daysLeft === 0 ? "urgent" : ""
                }`}
              >
                {task.daysLeft === 0 ? "Hoy" : `${task.daysLeft}d`}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="widget-button primary">
        <ExternalLink className="icon-sm" />
        Abrir Classroom
      </button>
    </div>
  );
};
