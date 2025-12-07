import React from "react";
import { useTranslation } from "react-i18next";
import { Zap, Plus, ListTodo, Search } from "lucide-react";
import { useCommand } from "@/contexts/CommandContext";

export const QuickActions = ({ onCreateList }) => {
  const { t } = useTranslation();
  const { openListsSearch, openTasksSearch } = useCommand();

  const handleCreateList = () => {
    if (onCreateList) {
      onCreateList(); // Abre el modal de crear lista sin preset
    }
  };

  const handleViewLists = () => {
    // Pasar el callback para que cuando se cree una lista desde el command, se abra el modal
    openListsSearch(onCreateList);
  };

  return (
    <div className="widget quick-actions">
      <div className="quick-actions-header">
        <Zap className="icon-md" />
        <h3 className="widget-title" style={{ color: "white" }}>
          {t("widgets.quickActions")}
        </h3>
      </div>
      <div className="quick-actions-list">
        <button className="quick-action-button" onClick={handleCreateList}>
          <Plus className="icon-sm" />
          {t("widgets.createList", "Crear Lista")}
        </button>
        <button className="quick-action-button" onClick={handleViewLists}>
          <ListTodo className="icon-sm" />
          {t("widgets.viewLists", "Ver Listas")}
        </button>
        <button
          className="quick-action-button"
          onClick={() => openTasksSearch()}
        >
          <Search className="icon-sm" />
          {t("widgets.searchTasks", "Buscar Tarea")}
        </button>
      </div>
    </div>
  );
};
