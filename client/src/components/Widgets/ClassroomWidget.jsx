import React from "react";
import { useTranslation } from "react-i18next";
import { GraduationCap, ExternalLink } from "lucide-react";

export const ClassroomWidget = ({ classroomTasks }) => {
  const { t } = useTranslation();

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
      {classroomTasks.length === 0 ? (
        <div
          style={{
            padding: "2rem 1rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              lineHeight: "1.5",
            }}
          >
            No tienes ninguna tarea vinculada con Classroom
          </p>
        </div>
      ) : (
        <>
          <div className="classroom-list">
            {classroomTasks.slice(0, 4).map((task) => {
              const daysLeft = getDaysLeft(task.due_date);
              return (
                <div key={task.id} className="classroom-card">
                  <p className="classroom-task-title">{task.title}</p>
                  <div className="classroom-task-footer">
                    <span className="classroom-subject">
                      {task.classroom_integration?.course_id || "Classroom"}
                    </span>
                    {daysLeft !== null && (
                      <span
                        className={`classroom-days ${
                          daysLeft === 0 ? "urgent" : ""
                        }`}
                      >
                        {daysLeft === 0 ? t("tasks.today") : `${daysLeft}d`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button className="widget-button primary">
            <ExternalLink className="icon-sm" />
            {t("widgets.openClassroom")}
          </button>
        </>
      )}
    </div>
  );
};
