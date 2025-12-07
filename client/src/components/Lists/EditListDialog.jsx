import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  Calendar,
  Users,
  Lock,
  Settings,
  ChevronDown,
  ChevronUp,
  Loader2,
  LogOut,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AVAILABLE_ICONS, AVAILABLE_COLORS } from "./CreateListDialog";
import { listsApi } from "@/services/api";

export function EditListDialog({
  open,
  onOpenChange,
  list,
  onUpdateList,
  currentUserId,
  onLeaveList,
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("list");
  const [selectedColor, setSelectedColor] = useState("#4f46e5");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Configuration settings
  const [showDates, setShowDates] = useState(true);
  const [enableAssignments, setEnableAssignments] = useState(true);
  const [restrictEditing, setRestrictEditing] = useState(false);

  // Determinar si es el owner
  const isOwner = list?.owner_id === currentUserId || list?.role === "owner";
  const canEdit = isOwner || list?.role === "editor";

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cargar datos de la lista cuando se abre el dialog
  useEffect(() => {
    if (list && open) {
      setTitle(list.title || "");
      setSelectedIcon(list.icon || "list");
      setSelectedColor(list.color || "#4f46e5");
      setShowDates(list.configuration?.show_dates ?? true);
      setEnableAssignments(list.configuration?.enable_assignments ?? true);
      setRestrictEditing(
        list.configuration?.restrict_editing_to_assignee ?? false
      );
      setShowAdvanced(false);
    }
  }, [list, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !list) return;

    setIsLoading(true);

    const listData = {
      title: title.trim(),
      icon: selectedIcon,
      color: selectedColor,
      configuration: {
        type: "standard",
        show_dates: showDates,
        enable_assignments: enableAssignments,
        restrict_editing_to_assignee: restrictEditing,
      },
    };

    try {
      const result = await onUpdateList(list.id, listData);
      if (result?.success) {
        toast.success(t("lists.updated"));
        onOpenChange(false);
      } else {
        toast.error(result?.error || t("lists.errorUpdating"));
      }
    } catch (err) {
      toast.error(t("lists.errorUpdating"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (open) => {
    if (!open) {
      setShowAdvanced(false);
    }
    onOpenChange(open);
  };

  const handleLeaveList = async () => {
    if (!list) return;

    setIsLeaving(true);
    try {
      const result = await listsApi.leaveList(list.id);
      if (result?.success) {
        toast.success(t("lists.leftList") || "Has salido de la lista");
        setShowLeaveDialog(false);
        handleClose(false);
        if (onLeaveList) {
          onLeaveList(list.id);
        }
      } else {
        toast.error(
          result?.error || t("lists.errorLeaving") || "Error al salir"
        );
      }
    } catch (err) {
      toast.error(t("lists.errorLeaving") || "Error al salir de la lista");
    } finally {
      setIsLeaving(false);
    }
  };

  const SelectedIconComponent =
    AVAILABLE_ICONS.find((i) => i.id === selectedIcon)?.icon ||
    AVAILABLE_ICONS[0].icon;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="create-list-dialog">
        <DialogHeader>
          <DialogTitle>
            {isOwner ? t("lists.editTitle") : t("lists.viewTitle")}
          </DialogTitle>
          <DialogDescription>
            {isOwner ? t("lists.editDescription") : t("lists.viewDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="create-list-form">
          {/* Preview */}
          <div className="list-preview">
            <div
              className="list-preview-icon"
              style={{ background: selectedColor }}
            >
              <SelectedIconComponent className="list-preview-icon-svg" />
            </div>
            <span className="list-preview-title">
              {title || t("lists.untitled")}
            </span>
          </div>

          {/* Title Input */}
          <div className="form-field field-title">
            <Label htmlFor="list-title">{t("lists.titleLabel")}</Label>
            <Input
              id="list-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("lists.titlePlaceholder")}
              autoFocus={canEdit}
              maxLength={50}
              disabled={!canEdit}
            />
          </div>

          {/* Icon Selector */}
          <div className="form-field">
            <Label>{t("lists.iconLabel")}</Label>
            <div className="icon-grid">
              {AVAILABLE_ICONS.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`icon-option ${
                    selectedIcon === id ? "selected" : ""
                  }`}
                  onClick={() => canEdit && setSelectedIcon(id)}
                  disabled={!canEdit}
                  style={
                    selectedIcon === id
                      ? {
                          borderColor: selectedColor,
                          background: `${selectedColor}15`,
                        }
                      : {}
                  }
                >
                  <Icon
                    className="icon-option-svg"
                    style={selectedIcon === id ? { color: selectedColor } : {}}
                  />
                  {selectedIcon === id && (
                    <span
                      className="icon-check"
                      style={{ background: selectedColor }}
                    >
                      <Check className="icon-check-svg" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="form-field">
            <Label>{t("lists.colorLabel")}</Label>
            <div className="color-grid">
              {AVAILABLE_COLORS.map(({ id, value }) => (
                <button
                  key={id}
                  type="button"
                  className={`color-option ${
                    selectedColor === value ? "selected" : ""
                  }`}
                  style={{ background: value }}
                  onClick={() => canEdit && setSelectedColor(value)}
                  disabled={!canEdit}
                >
                  {selectedColor === value && (
                    <Check className="color-check-svg" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Settings Toggle - Solo en móvil */}
          {isMobile && (
            <button
              type="button"
              className="advanced-settings-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
              disabled={!canEdit}
            >
              <Settings className="icon-sm" />
              <span>{t("lists.advancedSettings")}</span>
              {showAdvanced ? (
                <ChevronUp className="icon-sm" />
              ) : (
                <ChevronDown className="icon-sm" />
              )}
            </button>
          )}

          {/* Advanced Settings */}
          {(showAdvanced || !isMobile) && (
            <div
              className={`advanced-settings-panel ${
                isMobile ? "collapsible" : ""
              }`}
            >
              {/* Show Dates */}
              <div className="setting-item">
                <div className="setting-info">
                  <Label htmlFor="show-dates">
                    <Calendar className="icon-xs" />
                    {t("lists.settings.showDates")}
                  </Label>
                  <span className="setting-description">
                    {t("lists.settings.showDatesDescription")}
                  </span>
                </div>
                <Switch
                  id="show-dates"
                  checked={showDates}
                  onCheckedChange={setShowDates}
                  disabled={!canEdit}
                />
              </div>

              {/* Enable Assignments */}
              <div className="setting-item">
                <div className="setting-info">
                  <Label htmlFor="enable-assignments">
                    <Users className="icon-xs" />
                    {t("lists.settings.enableAssignments")}
                  </Label>
                  <span className="setting-description">
                    {t("lists.settings.enableAssignmentsDescription")}
                  </span>
                </div>
                <Switch
                  id="enable-assignments"
                  checked={enableAssignments}
                  onCheckedChange={setEnableAssignments}
                  disabled={!canEdit}
                />
              </div>

              {/* Restrict Editing */}
              <div className="setting-item">
                <div className="setting-info">
                  <Label htmlFor="restrict-editing">
                    <Lock className="icon-xs" />
                    {t("lists.settings.restrictEditing")}
                  </Label>
                  <span className="setting-description">
                    {t("lists.settings.restrictEditingDescription")}
                  </span>
                </div>
                <Switch
                  id="restrict-editing"
                  checked={restrictEditing}
                  onCheckedChange={setRestrictEditing}
                  disabled={!enableAssignments || !canEdit}
                />
              </div>
            </div>
          )}

          <DialogFooter className="create-list-footer gap-2">
            {!isOwner && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowLeaveDialog(true)}
                disabled={isLoading}
                className="mr-auto"
              >
                <LogOut className="icon-sm" />
                {t("lists.leaveList")}
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleClose(false)}
              disabled={isLoading}
            >
              {canEdit ? t("common.cancel") : t("common.close")}
            </Button>
            {canEdit && (
              <Button type="submit" disabled={!title.trim() || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="icon-sm spin-animation" />
                    {t("common.saving")}
                  </>
                ) : (
                  t("common.save")
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Leave List Confirmation Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("lists.leaveListTitle") || "¿Salir de la lista?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("lists.leaveListDescription") ||
                "Ya no tendrás acceso a esta lista ni a sus tareas. Esta acción no se puede deshacer."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLeaving}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveList}
              disabled={isLeaving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLeaving ? (
                <>
                  <Loader2 className="icon-sm spin-animation" />
                  {t("common.leaving") || "Saliendo..."}
                </>
              ) : (
                t("lists.leaveList") || "Salir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
