import React from "react";
import { useTranslation } from "react-i18next";
import { GraduationCap, ExternalLink } from "lucide-react";

export const ClassroomWidget = ({ classroomTasks }) => {
  const { t } = useTranslation();
  return (
    <div className="widget classroom-widget">
      <div className="widget-header">
        <div className="widget-title-group">
          <div className="classroom-icon">
            <GraduationCap className="icon-sm" />
          </div>
          <h3 className="widget-title">{t("stats.classroom")}</h3>
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
                {task.daysLeft === 0 ? t("tasks.today") : `${task.daysLeft}d`}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="widget-button primary">
        <ExternalLink className="icon-sm" />
        {t("widgets.openClassroom")}
      </button>
    </div>
  );
};
