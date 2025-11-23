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
          className={cn(
            "task-date-input justify-start text-left font-normal gap-2",
            !date && "text-muted-foreground"
          )}
          size="sm"
        >
          <CalendarIcon className="h-4 w-4" />
          {date ? (
            <>
              <span>{formatDisplayDate()}</span>
              <X
                className="h-3 w-3 ml-auto hover:text-destructive"
                onClick={handleClear}
              />
            </>
          ) : (
            <span>{t("tasks.selectDate")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col">
          {/* Calendario */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            locale={getDateLocale()}
          />

          {/* Separador */}
          <div className="border-t border-border"></div>

          {/* Opciones de tiempo */}
          <div className="p-3 space-y-3">
            {/* Toggle día completo */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t("tasks.allDay")}
              </label>
              <button
                type="button"
                role="switch"
                aria-checked={isAllDay}
                onClick={handleAllDayToggle}
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                  isAllDay ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    isAllDay ? "translate-x-5" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>

            {/* Selector de hora (solo si no es día completo) */}
            {!isAllDay && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="flex-1 h-8 text-sm"
                />
              </div>
            )}

            {/* Botón para aplicar y cerrar */}
            <Button size="sm" className="w-full" onClick={() => setOpen(false)}>
              {t("common.apply") || "Aplicar"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
