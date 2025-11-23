import { ExternalLink, BookOpen, Calendar, Link2 } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Badge clicable que muestra información de una tarea vinculada a Google Classroom
 * @param {Object} classroomIntegration - Información de la integración con Classroom
 * @param {Object} task - La tarea completa para mostrar información adicional
 */
export const ClassroomBadge = ({ classroomIntegration, task }) => {
  const { t, i18n } = useTranslation();

  // Mapear el idioma actual a los locales de date-fns
  const getDateLocale = () => {
    return i18n.language === "es" ? es : enUS;
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return t("tasks.noDate");
    try {
      const date = new Date(dateString);
      return format(date, "PPp", { locale: getDateLocale() });
    } catch {
      return t("tasks.invalidDate");
    }
  };

  if (!classroomIntegration) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="task-badge classroom inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors cursor-pointer dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
          onClick={(e) => e.stopPropagation()}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Classroom
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  {t("tasks.classroomTask")}
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  {t("tasks.linkedToClassroom")}
                </CardDescription>
              </div>
              {classroomIntegration.alternate_link && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={classroomIntegration.alternate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Título de la tarea */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {t("tasks.taskTitle")}
              </p>
              <p className="text-sm font-medium">{task.title}</p>
            </div>

            {/* ID del curso */}
            {classroomIntegration.course_id && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {t("tasks.courseId")}
                </p>
                <p className="text-sm">{classroomIntegration.course_id}</p>
              </div>
            )}

            {/* Descripción de la tarea si existe */}
            {task.description && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {t("tasks.description")}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {task.description}
                </p>
              </div>
            )}

            {/* Fecha de entrega */}
            {task.due_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t("tasks.dueDate")}
                  </p>
                  <p className="text-sm">{formatDate(task.due_date)}</p>
                </div>
              </div>
            )}

            {/* ID de la tarea de Classroom */}
            {classroomIntegration.course_work_id && (
              <div className="pt-2 border-t">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {t("tasks.classroomId")}
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  {classroomIntegration.course_work_id}
                </p>
              </div>
            )}

            {/* Última sincronización */}
            {classroomIntegration.last_synced_at && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  {t("tasks.lastSynced")}:{" "}
                  {formatDate(classroomIntegration.last_synced_at)}
                </p>
              </div>
            )}

            {/* Botón para abrir en Classroom */}
            {classroomIntegration.alternate_link && (
              <Button
                className="w-full mt-2"
                size="sm"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={classroomIntegration.alternate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t("tasks.openInClassroom")}
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
