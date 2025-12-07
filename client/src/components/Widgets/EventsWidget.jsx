import React from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Sparkles } from "lucide-react";

export const EventsWidget = () => {
  const { t } = useTranslation();
  return (
    <div className="widget events-widget">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1.5rem",
          textAlign: "center",
          minHeight: "200px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <Sparkles
            style={{ width: "32px", height: "32px", color: "#8b5cf6" }}
          />
        </div>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          {t("widgets.eventsToday")}
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            fontWeight: "500",
          }}
        >
          Próximamente
        </p>
      </div>
    </div>
  );
};
