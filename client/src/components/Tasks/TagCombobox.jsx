import React, { useState } from "react";
import { Check, ChevronsUpDown, Plus, Tag, X } from "lucide-react";
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

  const handleSelect = (tagId) => {
    const isSelected = selectedTags.includes(tagId);
    const newSelectedTags = isSelected
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];

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
    } else {
      // Si no existe, crear uno nuevo
      const result = await onCreateTag(searchValue.trim());
      if (result?.success && result?.data) {
        handleSelect(result.data.id);
      }
    }
    setSearchValue("");
  };

  const selectedTagsData = tags.filter((tag) => selectedTags.includes(tag.id));
  const MAX_VISIBLE_TAGS = 2; // Máximo de tags a mostrar antes de usar contador

  const handleRemoveTag = (tagId, e) => {
    e.stopPropagation();
    const newSelectedTags = selectedTags.filter((id) => id !== tagId);
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
              Seleccionar etiquetas...
            </span>
          )}
          <ChevronsUpDown className="tag-combobox-chevron" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="tag-combobox-popover" align="start">
        <Command>
          <CommandInput
            placeholder="Buscar o crear etiqueta..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {searchValue.trim() && onCreateTag ? (
                <div onClick={handleCreateTag} className="tag-combobox-create">
                  <Plus className="tag-combobox-create-icon" />
                  Crear "{searchValue}"
                </div>
              ) : (
                <span className="tag-combobox-empty">
                  No se encontraron etiquetas
                </span>
              )}
            </CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => handleSelect(tag.id)}
                    className="tag-combobox-option"
                  >
                    <Check
                      className={cn(
                        "tag-combobox-check",
                        isSelected && "selected"
                      )}
                    />
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
