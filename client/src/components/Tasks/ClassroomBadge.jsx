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
          className="classroom-badge-trigger"
          onClick={(e) => e.stopPropagation()}
        >
          <BookOpen className="classroom-badge-icon" />
          Classroom
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="classroom-badge-popover"
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="classroom-badge-card">
          <CardHeader className="pb-3">
            <div className="classroom-badge-header">
              <div className="classroom-badge-header-content">
                <CardTitle className="classroom-badge-title">
                  <BookOpen className="classroom-badge-title-icon" />
                  {t("tasks.classroomTask")}
                </CardTitle>
                <CardDescription className="classroom-badge-subtitle">
                  {t("tasks.linkedToClassroom")}
                </CardDescription>
              </div>
              {classroomIntegration.alternate_link && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="classroom-badge-external-btn"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={classroomIntegration.alternate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="classroom-badge-external-icon" />
                  </a>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="classroom-badge-content">
            {/* Título de la tarea */}
            <div className="classroom-badge-section">
              <p className="classroom-badge-label">{t("tasks.taskTitle")}</p>
              <p className="classroom-badge-value">{task.title}</p>
            </div>

            {/* ID del curso */}
            {classroomIntegration.course_id && (
              <div className="classroom-badge-section">
                <p className="classroom-badge-label">{t("tasks.courseId")}</p>
                <p className="classroom-badge-value-secondary">
                  {classroomIntegration.course_id}
                </p>
              </div>
            )}

            {/* Descripción de la tarea si existe */}
            {task.description && (
              <div className="classroom-badge-section">
                <p className="classroom-badge-label">
                  {t("tasks.description")}
                </p>
                <p className="classroom-badge-description">
                  {task.description}
                </p>
              </div>
            )}

            {/* Fecha de entrega */}
            {task.due_date && (
              <div className="classroom-badge-date-row classroom-badge-section">
                <Calendar className="classroom-badge-date-icon" />
                <div className="classroom-badge-date-content">
                  <p className="classroom-badge-label">{t("tasks.dueDate")}</p>
                  <p className="classroom-badge-value-secondary">
                    {formatDate(task.due_date)}
                  </p>
                </div>
              </div>
            )}

            {/* ID de la tarea de Classroom */}
            {classroomIntegration.course_work_id && (
              <div className="classroom-badge-id-section classroom-badge-section">
                <p className="classroom-badge-label">
                  {t("tasks.classroomId")}
                </p>
                <p className="classroom-badge-id-value">
                  {classroomIntegration.course_work_id}
                </p>
              </div>
            )}

            {/* Última sincronización */}
            {classroomIntegration.last_synced_at && (
              <div className="classroom-badge-sync-row">
                <Link2 className="classroom-badge-sync-icon" />
                <p className="classroom-badge-sync-text">
                  {t("tasks.lastSynced")}:{" "}
                  {formatDate(classroomIntegration.last_synced_at)}
                </p>
              </div>
            )}

            {/* Botón para abrir en Classroom */}
            {classroomIntegration.alternate_link && (
              <div className="classroom-badge-open-wrapper">
                <Button size="sm" asChild onClick={(e) => e.stopPropagation()}>
                  <a
                    href={classroomIntegration.alternate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="classroom-badge-open-btn"
                  >
                    <ExternalLink className="classroom-badge-external-icon" />
                    {t("tasks.openInClassroom")}
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
