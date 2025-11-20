import React from "react";
import { Calendar } from "lucide-react";
import { EventCard } from "./EventCard";

export const EventsWidget = ({ events }) => {
  return (
    <div className="widget events-widget">
      <div className="widget-header">
        <h3 className="widget-title">Eventos Hoy</h3>
        <button className="widget-link">Ver todo</button>
      </div>
      <div className="events-list">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <button className="widget-button">
        <Calendar className="icon-sm" />
        Abrir calendario
      </button>
    </div>
  );
};
