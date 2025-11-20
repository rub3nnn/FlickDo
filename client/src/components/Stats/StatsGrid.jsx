import React from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, GraduationCap, Clock, CheckCircle2 } from "lucide-react";
import { StatCard } from "./StatCard";

export const StatsGrid = ({ tasks }) => {
  const { t } = useTranslation();
  const urgentTasks = tasks.filter(
    (t) => t.daysLeft === 0 && t.status !== "completed"
  );
  const classroomTasks = tasks.filter(
    (t) => t.type === "classroom" && t.status !== "completed"
  );
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");

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
