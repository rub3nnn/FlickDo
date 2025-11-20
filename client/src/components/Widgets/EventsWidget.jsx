import React from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";
import { EventCard } from "./EventCard";

export const EventsWidget = ({ events }) => {
  const { t } = useTranslation();
  return (
    <div className="widget events-widget">
      <div className="widget-header">
        <h3 className="widget-title">{t("widgets.eventsToday")}</h3>
        <button className="widget-link">{t("widgets.viewAll")}</button>
      </div>
      <div className="events-list">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <button className="widget-button">
        <Calendar className="icon-sm" />
        {t("widgets.openCalendar")}
      </button>
    </div>
  );
};
