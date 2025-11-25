import { useTranslation } from "react-i18next";
import { Plus, Briefcase, GraduationCap, ListTodo } from "lucide-react";

export function EmptyState({ onCreateList }) {
  const { t } = useTranslation();

  return (
    <div className="all-tasks-empty-state">
      <div className="empty-state-content">
        <div className="empty-state-illustration">
          <div className="illustration-bg-circle"></div>
          <div className="illustration-icon-wrapper">
            <ListTodo className="illustration-icon" />
          </div>
          <div className="illustration-floating-card card-1">
            <div className="mini-card-header"></div>
            <div className="mini-card-line"></div>
            <div className="mini-card-line short"></div>
          </div>
          <div className="illustration-floating-card card-2">
            <div className="mini-card-header"></div>
            <div className="mini-card-line"></div>
            <div className="mini-card-line short"></div>
          </div>
          <div className="illustration-floating-card card-3">
            <div className="mini-card-header"></div>
            <div className="mini-card-line"></div>
            <div className="mini-card-line short"></div>
          </div>
        </div>
        <h2 className="empty-state-title-modern">
          {t("allTasks.noLists") || "No tienes listas todavía"}
        </h2>
        <p className="empty-state-description-modern">
          {t("allTasks.createFirstList") ||
            "Crea tu primera lista para empezar a organizar tus tareas"}
        </p>
        <div className="empty-state-actions">
          <button
            className="empty-state-primary-btn"
            onClick={() => onCreateList?.()}
          >
            <Plus className="icon-sm" />
            {t("allTasks.newList") || "Crear lista"}
          </button>
          <button className="empty-state-secondary-btn">
            <GraduationCap className="icon-sm" />
            {t("allTasks.learnMore") || "Ver tutorial"}
          </button>
        </div>
        <div className="empty-state-suggestions">
          <p className="suggestions-title">
            {t("allTasks.suggestions") || "Sugerencias para empezar:"}
          </p>
          <div className="suggestions-grid">
            <div
              className="suggestion-card"
              onClick={() => onCreateList?.("Trabajo")}
            >
              <div
                className="suggestion-icon"
                style={{ background: "#4f46e5" }}
              >
                <Briefcase className="icon-xs" />
              </div>
              <span className="suggestion-text">
                {t("allTasks.workList") || "Trabajo"}
              </span>
            </div>
            <div
              className="suggestion-card"
              onClick={() => onCreateList?.("Estudios")}
            >
              <div
                className="suggestion-icon"
                style={{ background: "#9333ea" }}
              >
                <GraduationCap className="icon-xs" />
              </div>
              <span className="suggestion-text">
                {t("allTasks.studyList") || "Estudios"}
              </span>
            </div>
            <div
              className="suggestion-card"
              onClick={() => onCreateList?.("Personal")}
            >
              <div
                className="suggestion-icon"
                style={{ background: "#10b981" }}
              >
                <ListTodo className="icon-xs" />
              </div>
              <span className="suggestion-text">
                {t("allTasks.personalList") || "Personal"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
