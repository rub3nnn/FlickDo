import React, { useState, useEffect } from "react";
import { CalendarIcon, Clock, X } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Componente para seleccionar fecha, hora y día completo
 * @param {Object} props
 * @param {string} props.value - Fecha en formato ISO string o null
 * @param {boolean} props.isAllDay - Si es día completo
 * @param {Function} props.onChange - Callback cuando cambia la fecha/hora
 * @param {Function} props.onAllDayChange - Callback cuando cambia el estado de día completo
 * @param {Function} props.onClear - Callback para borrar la fecha
 */
export const DateTimePicker = ({
  value,
  isAllDay = true,
  onChange,
  onAllDayChange,
  onClear,
}) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  // Parsear la fecha inicial
  const parseDate = (dateString) => {
    if (!dateString) return undefined;
    try {
      const parsedDate = new Date(dateString);
      return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
    } catch {
      return undefined;
    }
  };

  const [date, setDate] = useState(parseDate(value));
  const [time, setTime] = useState(() => {
    if (!value || isAllDay) return "09:00";
    const d = new Date(value);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  });

  // Mapear el idioma actual a los locales de date-fns
  const getDateLocale = () => {
    return i18n.language === "es" ? es : enUS;
  };

  // Formatear fecha para mostrar
  const formatDisplayDate = () => {
    if (!date) return null;
    if (isAllDay) {
      return format(date, "PP", { locale: getDateLocale() });
    }
    const [hours, minutes] = time.split(":");
    const dateWithTime = new Date(date);
    dateWithTime.setHours(parseInt(hours), parseInt(minutes));
    return format(dateWithTime, "PPp", { locale: getDateLocale() });
  };

  // Manejar selección de fecha
  const handleDateSelect = (selectedDate) => {
    if (!selectedDate) return;
    setDate(selectedDate);

    // Si es día completo, establecer hora a medianoche
    if (isAllDay) {
      const dateAtMidnight = new Date(selectedDate);
      dateAtMidnight.setHours(0, 0, 0, 0);
      onChange(dateAtMidnight.toISOString());
    } else {
      // Si tiene hora, combinar fecha y hora
      const [hours, minutes] = time.split(":");
      const dateWithTime = new Date(selectedDate);
      dateWithTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      onChange(dateWithTime.toISOString());
    }
  };

  // Manejar cambio de hora
  const handleTimeChange = (newTime) => {
    setTime(newTime);
    if (date && !isAllDay) {
      const [hours, minutes] = newTime.split(":");
      const dateWithTime = new Date(date);
      dateWithTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      onChange(dateWithTime.toISOString());
    }
  };

  // Manejar toggle de día completo
  const handleAllDayToggle = () => {
    const newAllDay = !isAllDay;
    onAllDayChange(newAllDay);

    if (date) {
      if (newAllDay) {
        // Cambiar a día completo (medianoche)
        const dateAtMidnight = new Date(date);
        dateAtMidnight.setHours(0, 0, 0, 0);
        onChange(dateAtMidnight.toISOString());
      } else {
        // Cambiar a con hora
        const [hours, minutes] = time.split(":");
        const dateWithTime = new Date(date);
        dateWithTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        onChange(dateWithTime.toISOString());
      }
    }
  };

  // Manejar borrado de fecha
  const handleClear = (e) => {
    e.stopPropagation();
    setDate(undefined);
    if (onClear) {
      onClear();
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("task-date-input", !date && "muted-foreground")}
          size="sm"
        >
          <CalendarIcon className="datetime-picker-icon" />
          {date ? (
            <>
              <span>{formatDisplayDate()}</span>
              <X className="datetime-picker-clear" onClick={handleClear} />
            </>
          ) : (
            <span>{t("tasks.selectDate")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="datetime-picker-popover" align="start">
        <div className="datetime-picker-content">
          {/* Calendario */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            locale={getDateLocale()}
          />

          {/* Separador */}
          <div className="datetime-picker-separator"></div>

          {/* Opciones de tiempo */}
          <div className="datetime-picker-options">
            {/* Toggle día completo */}
            <div className="datetime-picker-toggle-row">
              <label className="datetime-picker-toggle-label">
                <Clock className="datetime-picker-icon" />
                {t("tasks.allDay")}
              </label>
              <button
                type="button"
                role="switch"
                aria-checked={isAllDay}
                onClick={handleAllDayToggle}
                className={cn(
                  "toggle-switch",
                  isAllDay ? "toggle-on" : "toggle-off"
                )}
              >
                <span className="toggle-switch-thumb" />
              </button>
            </div>

            {/* Selector de hora (solo si no es día completo) */}
            {!isAllDay && (
              <div className="datetime-picker-time-row">
                <Clock className="datetime-picker-time-icon" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="datetime-picker-time-input"
                />
              </div>
            )}

            {/* Botón para aplicar y cerrar */}
            <Button
              size="sm"
              className="full-width-btn"
              onClick={() => setOpen(false)}
            >
              {t("common.apply") || "Aplicar"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
