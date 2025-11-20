import React from "react";
import { useTranslation } from "react-i18next";
import { Zap, Plus, Calendar, Users } from "lucide-react";

export const QuickActions = () => {
  const { t } = useTranslation();
  return (
    <div className="widget quick-actions">
      <div className="quick-actions-header">
        <Zap className="icon-md" />
        <h3 className="widget-title">{t("widgets.quickActions")}</h3>
      </div>
      <div className="quick-actions-list">
        <button className="quick-action-button">
          <Plus className="icon-sm" />
          {t("widgets.newTask")}
        </button>
        <button className="quick-action-button">
          <Calendar className="icon-sm" />
          {t("widgets.scheduleEvent")}
        </button>
        <button className="quick-action-button">
          <Users className="icon-sm" />
          {t("widgets.shareProject")}
        </button>
      </div>
    </div>
  );
};
