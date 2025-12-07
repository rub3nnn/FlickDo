import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  Star,
  Briefcase,
  Home,
  Heart,
  BookOpen,
  ShoppingCart,
  Plane,
  Music,
  Camera,
  Coffee,
  Gamepad2,
  Palette,
  Dumbbell,
  Gift,
  Lightbulb,
  Code,
  Check,
  List,
  Calendar,
  Users,
  Lock,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Iconos disponibles para listas
const AVAILABLE_ICONS = [
  { id: "list", icon: List, label: "List" },
  { id: "star", icon: Star, label: "Star" },
  { id: "briefcase", icon: Briefcase, label: "Work" },
  { id: "home", icon: Home, label: "Home" },
  { id: "heart", icon: Heart, label: "Personal" },
  { id: "book", icon: BookOpen, label: "Study" },
  { id: "cart", icon: ShoppingCart, label: "Shopping" },
  { id: "plane", icon: Plane, label: "Travel" },
  { id: "music", icon: Music, label: "Music" },
  { id: "camera", icon: Camera, label: "Photos" },
  { id: "coffee", icon: Coffee, label: "Break" },
  { id: "gamepad", icon: Gamepad2, label: "Gaming" },
  { id: "palette", icon: Palette, label: "Creative" },
  { id: "dumbbell", icon: Dumbbell, label: "Fitness" },
  { id: "gift", icon: Gift, label: "Gifts" },
  { id: "lightbulb", icon: Lightbulb, label: "Ideas" },
  { id: "code", icon: Code, label: "Code" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
];

// Colores disponibles para listas
const AVAILABLE_COLORS = [
  { id: "indigo", value: "#4f46e5" },
  { id: "purple", value: "#9333ea" },
  { id: "pink", value: "#ec4899" },
  { id: "red", value: "#ef4444" },
  { id: "orange", value: "#f97316" },
  { id: "amber", value: "#f59e0b" },
  { id: "emerald", value: "#10b981" },
  { id: "teal", value: "#14b8a6" },
  { id: "cyan", value: "#06b6d4" },
  { id: "blue", value: "#3b82f6" },
  { id: "slate", value: "#64748b" },
  { id: "zinc", value: "#71717a" },
];

export function CreateListDialog({
  open,
  onOpenChange,
  onCreateList,
  isLoading = false,
  initialTitle = "",
  initialIcon = "list",
  initialColor = "#4f46e5",
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Configuration settings
  const [showDates, setShowDates] = useState(true);
  const [enableAssignments, setEnableAssignments] = useState(true);
  const [restrictEditing, setRestrictEditing] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Actualizar estado cuando cambian los props iniciales
  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setSelectedIcon(initialIcon);
      setSelectedColor(initialColor);
      setShowAdvanced(false);
    }
  }, [open, initialTitle, initialIcon, initialColor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isLoading) return;

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
      const result = await onCreateList(listData);
      if (result?.success) {
        resetForm();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const resetForm = () => {
    setTitle(initialTitle);
    setSelectedIcon(initialIcon);
    setSelectedColor(initialColor);
    setShowAdvanced(false);
    setShowDates(true);
    setEnableAssignments(true);
    setRestrictEditing(false);
  };

  const handleClose = (open) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  const SelectedIconComponent =
    AVAILABLE_ICONS.find((i) => i.id === selectedIcon)?.icon || Star;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="create-list-dialog">
        <DialogHeader>
          <DialogTitle>{t("lists.createTitle")}</DialogTitle>
          <DialogDescription>{t("lists.createDescription")}</DialogDescription>
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

          {/* Advanced Settings Toggle - Solo en móvil */}
          {isMobile && (
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

          <DialogFooter className="create-list-footer">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleClose(false)}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={!title.trim() || isLoading}>
              {isLoading ? t("common.creating") : t("lists.createButton")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { AVAILABLE_ICONS, AVAILABLE_COLORS };
