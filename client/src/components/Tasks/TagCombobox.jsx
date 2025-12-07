import React, { useState } from "react";
import { Check, ChevronsUpDown, Plus, Tag, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Colores predefinidos para las tags
const TAG_COLORS = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Red", value: "#EF4444" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Orange", value: "#F97316" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Cyan", value: "#06B6D4" },
];

/**
 * Componente para seleccionar tags con combobox
 * @param {Object} props
 * @param {Array} props.tags - Array de tags disponibles
 * @param {Array} props.selectedTags - Array de IDs de tags seleccionados
 * @param {Function} props.onTagsChange - Callback cuando cambian los tags seleccionados
 * @param {Function} props.onCreateTag - Callback para crear un nuevo tag
 * @param {boolean} props.disabled - Si el combobox está deshabilitado
 */
export const TagCombobox = ({
  tags = [],
  selectedTags = [],
  onTagsChange,
  onCreateTag,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0].value);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { t } = useTranslation();

  // Normalizar selectedTags para asegurar que sean IDs
  const normalizedSelectedTags = selectedTags.map((tag) =>
    typeof tag === "object" ? tag.id : tag
  );

  const handleSelect = (tagId) => {
    const isSelected = normalizedSelectedTags.includes(tagId);
    const newSelectedTags = isSelected
      ? normalizedSelectedTags.filter((id) => id !== tagId)
      : [...normalizedSelectedTags, tagId];

    onTagsChange(newSelectedTags);
  };

  const handleCreateTag = async () => {
    if (!searchValue.trim() || !onCreateTag) return;

    // Verificar si ya existe un tag con ese nombre
    const existingTag = tags.find(
      (tag) => tag.name.toLowerCase() === searchValue.trim().toLowerCase()
    );

    if (existingTag) {
      // Si existe, simplemente seleccionarlo
      handleSelect(existingTag.id);
      setSearchValue("");
      setShowCreateForm(false);
      return;
    }

    // Si no existe, crear uno nuevo con el color seleccionado
    setIsCreating(true);
    try {
      const result = await onCreateTag(searchValue.trim(), selectedColor);
      if (result?.success && result?.data) {
        handleSelect(result.data.id);
        toast.success(t("tasks.tagCreated") || "Tag creado correctamente");
        setSearchValue("");
        setShowCreateForm(false);
        // Resetear al primer color para la próxima creación
        setSelectedColor(TAG_COLORS[0].value);
      } else {
        toast.error(
          result?.error ||
            t("tasks.errorCreatingTag") ||
            "Error al crear el tag"
        );
      }
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error(t("tasks.errorCreatingTag") || "Error al crear el tag");
    } finally {
      setIsCreating(false);
    }
  };

  const selectedTagsData = tags.filter((tag) =>
    normalizedSelectedTags.includes(tag.id)
  );
  const MAX_VISIBLE_TAGS = 2; // Máximo de tags a mostrar antes de usar contador

  const handleRemoveTag = (tagId, e) => {
    e.stopPropagation();
    const newSelectedTags = normalizedSelectedTags.filter((id) => id !== tagId);
    onTagsChange(newSelectedTags);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="tag-combobox-trigger"
          size="sm"
          disabled={disabled}
        >
          {selectedTagsData.length > 0 ? (
            <div className="tag-combobox-content">
              {selectedTagsData.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
                <span
                  key={tag.id}
                  className="tag-combobox-item"
                  style={{
                    backgroundColor: tag.color + "20",
                    color: tag.color,
                  }}
                >
                  <div
                    className="tag-combobox-dot"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="tag-combobox-name">{tag.name}</span>
                  <span
                    onClick={(e) => handleRemoveTag(tag.id, e)}
                    className="tag-combobox-remove"
                  >
                    <X className="tag-combobox-remove-icon" />
                  </span>
                </span>
              ))}
              {selectedTagsData.length > MAX_VISIBLE_TAGS && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="tag-combobox-more">
                      +{selectedTagsData.length - MAX_VISIBLE_TAGS}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="tooltip-max-w">
                    <div className="tag-combobox-tooltip-content">
                      {selectedTagsData.slice(MAX_VISIBLE_TAGS).map((tag) => (
                        <span
                          key={tag.id}
                          className="tag-combobox-tooltip-item"
                          style={{
                            backgroundColor: tag.color + "20",
                            color: tag.color,
                          }}
                        >
                          <div
                            className="tag-combobox-dot"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          ) : (
            <span className="tag-combobox-placeholder">
              <Tag className="tag-combobox-icon" />
              {t("tasks.selectTagsPlaceholder")}
            </span>
          )}
          <ChevronsUpDown className="tag-combobox-chevron" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="tag-combobox-popover" align="start">
        <Command>
          <CommandInput
            placeholder={t("tasks.searchOrCreateTagPlaceholder")}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {searchValue.trim() && onCreateTag && !showCreateForm ? (
                <div
                  onClick={() => setShowCreateForm(true)}
                  className="tag-combobox-create"
                >
                  <Plus className="tag-combobox-create-icon" />
                  {t("tasks.createTag", { value: searchValue })}
                </div>
              ) : searchValue.trim() && onCreateTag && showCreateForm ? (
                <div className="tag-combobox-create-container">
                  <div className="tag-combobox-create-header">
                    <Plus className="tag-combobox-create-icon" />
                    <span>{t("tasks.createTag", { value: searchValue })}</span>
                  </div>
                  <div className="tag-combobox-color-picker">
                    <span className="tag-combobox-color-label">
                      {t("tasks.selectColor")}:
                    </span>
                    <div className="tag-combobox-color-grid">
                      {TAG_COLORS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          className={cn(
                            "tag-combobox-color-option",
                            selectedColor === color.value && "selected"
                          )}
                          style={{ backgroundColor: color.value }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedColor(color.value);
                          }}
                          title={color.name}
                        >
                          {selectedColor === color.value && (
                            <Check className="tag-combobox-color-check" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="tag-combobox-create-actions">
                    <Button
                      onClick={() => setShowCreateForm(false)}
                      variant="outline"
                      size="sm"
                      className="tag-combobox-cancel-button"
                    >
                      {t("tasks.cancel")}
                    </Button>
                    <Button
                      onClick={handleCreateTag}
                      disabled={isCreating}
                      size="sm"
                      className="tag-combobox-create-button"
                    >
                      {isCreating ? t("tasks.creating") : t("tasks.create")}
                    </Button>
                  </div>
                </div>
              ) : (
                <span className="tag-combobox-empty">
                  {t("tasks.noTagsFound")}
                </span>
              )}
            </CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => {
                const isSelected = normalizedSelectedTags.includes(tag.id);
                const checkClassName = cn(
                  "tag-combobox-check",
                  isSelected && "selected"
                );
                return (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => handleSelect(tag.id)}
                    className="tag-combobox-option"
                  >
                    <Check className={checkClassName} />
                    <div
                      className="tag-combobox-option-dot"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span>{tag.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
