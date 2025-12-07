import { Calendar, Users, Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

/**
 * Componente que muestra iconos de configuración de una lista
 * @param {Object} configuration - Configuración de la lista
 * @param {boolean} configuration.show_dates - Muestra fechas
 * @param {boolean} configuration.enable_assignments - Permite asignaciones
 * @param {boolean} configuration.restrict_editing_to_assignee - Restringe edición a asignado
 */
export function ListConfigIcons({ configuration, className = "" }) {
  const { t } = useTranslation();

  if (!configuration) return null;

  const {
    show_dates = true,
    enable_assignments = true,
    restrict_editing_to_assignee = false,
  } = configuration;

  // Solo mostramos iconos para configuraciones no-default o importantes
  const hasNonDefaultConfig =
    !show_dates || !enable_assignments || restrict_editing_to_assignee;

  if (!hasNonDefaultConfig) return null;

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-1 ${className}`}>
        {/* Calendario deshabilitado */}
        {!show_dates && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-5 h-5 text-muted-foreground/60">
                <Calendar className="w-4 h-4" strokeWidth={1.5} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">
                {t("lists.config.datesDisabled") || "Fechas deshabilitadas"}
              </p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Asignaciones deshabilitadas */}
        {!enable_assignments && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-5 h-5 text-muted-foreground/60">
                <Users className="w-4 h-4" strokeWidth={1.5} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">
                {t("lists.config.assignmentsDisabled") ||
                  "Asignaciones deshabilitadas"}
              </p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Edición restringida */}
        {restrict_editing_to_assignee && enable_assignments && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-5 h-5 text-amber-500/80">
                <Lock className="w-4 h-4" strokeWidth={1.5} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">
                {t("lists.config.restrictedEditing") ||
                  "Edición restringida al asignado"}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
