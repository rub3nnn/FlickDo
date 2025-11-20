import React from "react";
import { Zap, Plus, Calendar, Users } from "lucide-react";

export const QuickActions = () => {
  return (
    <div className="widget quick-actions">
      <div className="quick-actions-header">
        <Zap className="icon-md" />
        <h3 className="widget-title">Acciones Rápidas</h3>
      </div>
      <div className="quick-actions-list">
        <button className="quick-action-button">
          <Plus className="icon-sm" />
          Nueva tarea
        </button>
        <button className="quick-action-button">
          <Calendar className="icon-sm" />
          Agendar evento
        </button>
        <button className="quick-action-button">
          <Users className="icon-sm" />
          Compartir proyecto
        </button>
      </div>
    </div>
  );
};
