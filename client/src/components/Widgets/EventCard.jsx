import React from "react";
import { Users, MapPin } from "lucide-react";

export const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <div className="event-time">
        <span className="time-hour">{event.time.split(":")[0]}</span>
        <span className="time-minute">{event.time.split(":")[1]}</span>
      </div>
      <div className="event-details">
        <h4 className="event-title">{event.title}</h4>
        <div className="event-meta">
          <div className="event-meta-item">
            <Users className="icon-xs" />
            <span>{event.attendees}</span>
          </div>
          <span>•</span>
          <div className="event-meta-item">
            <MapPin className="icon-xs" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
      {event.urgent && <div className="event-urgent-dot" />}
    </div>
  );
};
