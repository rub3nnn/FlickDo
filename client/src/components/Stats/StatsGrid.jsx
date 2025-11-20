import React from "react";
import { AlertCircle, GraduationCap, Clock, CheckCircle2 } from "lucide-react";
import { StatCard } from "./StatCard";

export const StatsGrid = ({ tasks }) => {
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
        label="Urgente"
        value={urgentTasks.length}
        description="Para hoy"
        variant="urgent"
      />
      <StatCard
        icon={GraduationCap}
        label="Classroom"
        value={classroomTasks.length}
        description="Asignaciones"
        variant="classroom"
      />
      <StatCard
        icon={Clock}
        label="En progreso"
        value={inProgressTasks.length}
        description="Tareas activas"
        variant="progress"
      />
      <StatCard
        icon={CheckCircle2}
        label="Completadas"
        value={completedTasks.length}
        description="Esta semana"
        variant="completed"
      />
    </div>
  );
};
