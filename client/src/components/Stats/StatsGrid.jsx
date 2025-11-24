import React from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, GraduationCap, Clock, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "./StatCard";

export const StatsGrid = ({ tasks, loading = false }) => {
  const { t } = useTranslation();

  // Función auxiliar para calcular días restantes
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

  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            className="stat-card"
            style={{ height: "106px" }}
          ></Skeleton>
        ))}
      </div>
    );
  }

  const urgentTasks = tasks.filter((t) => {
    const daysLeft = getDaysLeft(t.due_date);
    return daysLeft !== null && daysLeft <= 1 && !t.is_completed;
  });

  const classroomTasks = tasks.filter(
    (t) => t.classroom_integration && !t.is_completed
  );

  // Tareas en progreso: tienen fecha de vencimiento y no están completadas
  const inProgressTasks = tasks.filter((t) => t.due_date && !t.is_completed);

  const completedTasks = tasks.filter((t) => t.is_completed);

  return (
    <div className="stats-grid">
      <StatCard
        icon={AlertCircle}
        label={t("stats.urgent")}
        value={urgentTasks.length}
        description={t("stats.urgentDesc")}
        variant="urgent"
      />
      <StatCard
        icon={GraduationCap}
        label={t("stats.classroom")}
        value={classroomTasks.length}
        description={t("stats.classroomDesc")}
        variant="classroom"
      />
      <StatCard
        icon={Clock}
        label={t("stats.inProgress")}
        value={inProgressTasks.length}
        description={t("stats.inProgressDesc")}
        variant="progress"
      />
      <StatCard
        icon={CheckCircle2}
        label={t("stats.completed")}
        value={completedTasks.length}
        description={t("stats.completedDesc")}
        variant="completed"
      />
    </div>
  );
};
