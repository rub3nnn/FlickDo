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
} from "lucide-react";
import { AVAILABLE_ICONS, AVAILABLE_COLORS } from "./CreateListDialog";

export function EditListDialog({ open, onOpenChange, list, onUpdateList }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("list");
  const [selectedColor, setSelectedColor] = useState("#4f46e5");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Configuration settings
  const [showDates, setShowDates] = useState(true);
  const [enableAssignments, setEnableAssignments] = useState(true);
  const [restrictEditing, setRestrictEditing] = useState(false);

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

  const SelectedIconComponent =
    AVAILABLE_ICONS.find((i) => i.id === selectedIcon)?.icon ||
    AVAILABLE_ICONS[0].icon;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="create-list-dialog">
        <DialogHeader>
          <DialogTitle>{t("lists.editTitle")}</DialogTitle>
          <DialogDescription>{t("lists.editDescription")}</DialogDescription>
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
          <div className="form-field">
            <Label htmlFor="list-title">{t("lists.titleLabel")}</Label>
            <Input
              id="list-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("lists.titlePlaceholder")}
              autoFocus
              maxLength={50}
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
                  onClick={() => setSelectedIcon(id)}
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
                  onClick={() => setSelectedColor(value)}
                >
                  {selectedColor === value && (
                    <Check className="color-check-svg" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <button
            type="button"
            className="advanced-settings-toggle"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings className="icon-sm" />
            <span>{t("lists.advancedSettings")}</span>
            {showAdvanced ? (
              <ChevronUp className="icon-sm" />
            ) : (
              <ChevronDown className="icon-sm" />
            )}
          </button>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="advanced-settings-panel">
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
                  disabled={!enableAssignments}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleClose(false)}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={!title.trim() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="icon-sm animate-spin" />
                  {t("common.saving")}
                </>
              ) : (
                t("common.save")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
