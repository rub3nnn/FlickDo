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
          className="w-full justify-between"
          size="sm"
          disabled={disabled}
        >
          {selectedTagsData.length > 0 ? (
            <div className="flex gap-1 items-center overflow-hidden flex-1 min-w-0">
              {selectedTagsData.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: tag.color + "20",
                    color: tag.color,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="truncate max-w-20">{tag.name}</span>
                  <span
                    onClick={(e) => handleRemoveTag(tag.id, e)}
                    className="hover:bg-black/10 rounded-full p-0.5 transition-colors cursor-pointer"
                  >
                    <X className="h-2.5 w-2.5" />
                  </span>
                </span>
              ))}
              {selectedTagsData.length > MAX_VISIBLE_TAGS && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0 cursor-help">
                      +{selectedTagsData.length - MAX_VISIBLE_TAGS}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[250px]">
                    <div className="flex flex-wrap gap-1">
                      {selectedTagsData.slice(MAX_VISIBLE_TAGS).map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: tag.color + "20",
                            color: tag.color,
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
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
            <span className="text-muted-foreground flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Seleccionar etiquetas...
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Buscar o crear etiqueta..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {searchValue.trim() && onCreateTag ? (
                <div
                  onClick={handleCreateTag}
                  className="w-full px-2 py-1.5 text-sm hover:bg-accent rounded-sm flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Crear "{searchValue}"
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
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
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
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
