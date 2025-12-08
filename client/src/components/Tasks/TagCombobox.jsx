import React, { useState, useEffect } from "react";
import {
  Check,
  ChevronsUpDown,
  Plus,
  Tag,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

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
 * @param {Function} props.onUpdateTag - Callback para actualizar un tag
 * @param {Function} props.onDeleteTag - Callback para eliminar un tag
 * @param {boolean} props.disabled - Si el combobox está deshabilitado
 */
export const TagCombobox = ({
  tags = [],
  selectedTags = [],
  onTagsChange,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0].value);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [editTagName, setEditTagName] = useState("");
  const [editTagColor, setEditTagColor] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [deleteConfirmTimeout, setDeleteConfirmTimeout] = useState(null);
  const { t } = useTranslation();

  // Normalizar selectedTags para asegurar que sean IDs
  const normalizedSelectedTags = selectedTags.map((tag) =>
    typeof tag === "object" ? tag.id : tag
  );

  // Efecto para actualizar selectedTags cuando los tags temporales sean reemplazados
  useEffect(() => {
    // Buscar si hay IDs en selectedTags que ya no existen en tags
    const updatedTags = normalizedSelectedTags.map((selectedId) => {
      // Si el ID seleccionado no existe en la lista de tags disponibles
      if (!tags.find((t) => t.id === selectedId)) {
        // Buscar si existe un tag con ID numérico que no esté seleccionado
        // (probablemente el tag temporal fue reemplazado)
        const potentialMatch = tags.find(
          (t) =>
            typeof t.id === "number" && !normalizedSelectedTags.includes(t.id)
        );

        // Si encontramos un candidato, usar su ID
        return potentialMatch ? potentialMatch.id : selectedId;
      }
      return selectedId;
    });

    // Si hay cambios, actualizar
    if (
      JSON.stringify(updatedTags) !== JSON.stringify(normalizedSelectedTags)
    ) {
      onTagsChange(updatedTags);
    }
  }, [tags]);

  const handleSelect = (tagId) => {
    const isSelected = normalizedSelectedTags.includes(tagId);
    const newSelectedTags = isSelected
      ? normalizedSelectedTags.filter((id) => id !== tagId)
      : [...normalizedSelectedTags, tagId];

    onTagsChange(newSelectedTags);
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim() || !onCreateTag) return;

    // Verificar si ya existe un tag con ese nombre
    const existingTag = tags.find(
      (tag) => tag.name.toLowerCase() === newTagName.trim().toLowerCase()
    );

    if (existingTag) {
      toast.error(
        t("tasks.tagAlreadyExists") || "Ya existe una etiqueta con ese nombre"
      );
      return;
    }

    setIsCreating(true);

    const hexColor = selectedColor.match(/^#[0-9A-Fa-f]{6}$/)
      ? selectedColor
      : "#3B82F6";

    const tagName = newTagName.trim();

    // Limpiar el formulario inmediatamente
    setNewTagName("");
    setShowCreateForm(false);
    setSelectedColor(TAG_COLORS[0].value);

    try {
      console.log("📝 TagCombobox: Creating tag...", { tagName, hexColor });

      // Llamar a onCreateTag que maneja el optimistic update en el contexto
      const result = await onCreateTag(tagName, hexColor);

      console.log("📝 TagCombobox: Result from createTag:", result);

      if (result?.success && result?.data) {
        // El contexto devuelve el tag temporal en data
        // y el tag real en realTag cuando el servidor responde
        const tagToSelect = result.data;

        console.log("📝 TagCombobox: Adding tag to selection:", tagToSelect.id);

        // Añadir el tag (temporal o real) a los seleccionados
        const updatedTags = [...normalizedSelectedTags, tagToSelect.id];
        onTagsChange(updatedTags);

        toast.success(t("tasks.tagCreated") || "Etiqueta creada correctamente");

        // Si hay un realTag, significa que el servidor ya respondió
        // El contexto ya habrá actualizado la lista, solo necesitamos actualizar selectedTags
        if (result.realTag && result.tempId) {
          console.log("📝 TagCombobox: Replacing temp ID with real ID", {
            tempId: result.tempId,
            realId: result.realTag.id,
          });

          // Reemplazar el ID temporal con el real
          setTimeout(() => {
            const finalTags = updatedTags.map((id) =>
              id === result.tempId ? result.realTag.id : id
            );
            onTagsChange(finalTags);
          }, 100);
        }
      } else {
        console.error("❌ Error creating tag:", result);
        const errorMessage =
          result?.error ||
          result?.message ||
          t("tasks.errorCreatingTag") ||
          "Error al crear la etiqueta";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("❌ Exception creating tag:", error);
      toast.error(t("tasks.errorCreatingTag") || "Error al crear la etiqueta");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditTag = async () => {
    if (!editTagName.trim() || !onUpdateTag || !editingTag) return;

    // Verificar si ya existe otro tag con ese nombre
    const existingTag = tags.find(
      (tag) =>
        tag.id !== editingTag.id &&
        tag.name.toLowerCase() === editTagName.trim().toLowerCase()
    );

    if (existingTag) {
      toast.error(
        t("tasks.tagAlreadyExists") || "Ya existe una etiqueta con ese nombre"
      );
      return;
    }

    setIsUpdating(true);

    const hexColor = editTagColor.match(/^#[0-9A-Fa-f]{6}$/)
      ? editTagColor
      : "#3B82F6";

    try {
      const result = await onUpdateTag(editingTag.id, {
        name: editTagName.trim(),
        color: hexColor,
      });

      if (result?.success) {
        toast.success(
          t("tasks.tagUpdated") || "Etiqueta actualizada correctamente"
        );
        setEditingTag(null);
        setEditTagName("");
        setEditTagColor("");
      } else {
        const errorMessage =
          result?.error ||
          result?.message ||
          t("tasks.errorUpdatingTag") ||
          "Error al actualizar la etiqueta";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("❌ Exception updating tag:", error);
      toast.error(
        t("tasks.errorUpdatingTag") || "Error al actualizar la etiqueta"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTag = async () => {
    if (!onDeleteTag || !tagToDelete) return;

    setIsDeleting(true);

    try {
      const result = await onDeleteTag(tagToDelete.id);

      if (result?.success) {
        toast.success(
          t("tasks.tagDeleted") || "Etiqueta eliminada correctamente"
        );

        // Si el tag eliminado estaba seleccionado, quitarlo de la selección
        if (normalizedSelectedTags.includes(tagToDelete.id)) {
          const updatedTags = normalizedSelectedTags.filter(
            (id) => id !== tagToDelete.id
          );
          onTagsChange(updatedTags);
        }

        setTagToDelete(null);
      } else {
        const errorMessage =
          result?.error ||
          result?.message ||
          t("tasks.errorDeletingTag") ||
          "Error al eliminar la etiqueta";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("❌ Exception deleting tag:", error);
      toast.error(
        t("tasks.errorDeletingTag") || "Error al eliminar la etiqueta"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (tag, e) => {
    e.stopPropagation();

    // Si ya está en modo confirmación para este tag, ejecutar eliminación
    if (tagToDelete?.id === tag.id) {
      // Limpiar el timeout si existe
      if (deleteConfirmTimeout) {
        clearTimeout(deleteConfirmTimeout);
        setDeleteConfirmTimeout(null);
      }
      handleDeleteTag();
    } else {
      // Primera vez que se hace clic, entrar en modo confirmación
      setTagToDelete(tag);

      // Resetear después de 3 segundos
      const timeout = setTimeout(() => {
        setTagToDelete(null);
        setDeleteConfirmTimeout(null);
      }, 3000);

      setDeleteConfirmTimeout(timeout);
    }
  };

  // Limpiar timeout cuando se desmonta el componente
  useEffect(() => {
    return () => {
      if (deleteConfirmTimeout) {
        clearTimeout(deleteConfirmTimeout);
      }
    };
  }, [deleteConfirmTimeout]);

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
    <>
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
          <Command shouldFilter={!showCreateForm}>
            {!showCreateForm && (
              <CommandInput
                placeholder={
                  t("tasks.searchTagsPlaceholder") || "Buscar etiquetas..."
                }
                value={searchValue}
                onValueChange={setSearchValue}
              />
            )}

            {!showCreateForm && (
              <CommandList>
                {tags.length > 0 ? (
                  <>
                    <CommandEmpty>
                      <span className="tag-combobox-empty">
                        {t("tasks.noTagsFound") ||
                          "No se encontraron etiquetas"}
                      </span>
                    </CommandEmpty>
                    <CommandGroup>
                      {tags.map((tag) => {
                        const isSelected = normalizedSelectedTags.includes(
                          tag.id
                        );
                        const checkClassName = cn(
                          "tag-combobox-check",
                          isSelected && "selected"
                        );
                        return (
                          <CommandItem
                            key={tag.id}
                            value={tag.name}
                            onSelect={() => handleSelect(tag.id)}
                            className="tag-combobox-option group"
                          >
                            <div className="flex items-center flex-1 min-w-0 gap-2">
                              <Check className={checkClassName} />
                              <div
                                className="tag-combobox-option-dot"
                                style={{ backgroundColor: tag.color }}
                              />
                              <span className="truncate">{tag.name}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                              {onUpdateTag && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-blue-500/20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTag(tag);
                                    setEditTagName(tag.name);
                                    setEditTagColor(tag.color);
                                    setShowCreateForm(false);
                                  }}
                                >
                                  <Pencil className="h-3 w-3 text-blue-500" />
                                </Button>
                              )}
                              {onDeleteTag && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={cn(
                                        "h-6 w-6 p-0 transition-all",
                                        tagToDelete?.id === tag.id &&
                                          !isDeleting
                                          ? "bg-red-500/30 hover:bg-red-500/40 scale-110"
                                          : "hover:bg-red-500/20"
                                      )}
                                      onClick={(e) => handleDeleteClick(tag, e)}
                                      disabled={
                                        isDeleting && tagToDelete?.id === tag.id
                                      }
                                    >
                                      <Trash2
                                        className={cn(
                                          "h-3 w-3 text-red-500 transition-transform",
                                          tagToDelete?.id === tag.id &&
                                            !isDeleting &&
                                            "animate-pulse"
                                        )}
                                      />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p>
                                      {tagToDelete?.id === tag.id
                                        ? t("tasks.clickAgainToConfirm") ||
                                          "Click again to confirm"
                                        : t("tasks.delete") || "Delete"}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </>
                ) : (
                  <CommandEmpty>
                    <div className="tag-combobox-empty-state">
                      <Tag className="tag-combobox-empty-icon" />
                      <p className="tag-combobox-empty-title">
                        {t("tasks.noTagsYet") || "No hay etiquetas"}
                      </p>
                      <p className="tag-combobox-empty-description">
                        {t("tasks.createFirstTag") ||
                          "Crea tu primera etiqueta"}
                      </p>
                    </div>
                  </CommandEmpty>
                )}
              </CommandList>
            )}

            {/* Formulario de creación de tag */}
            {onCreateTag && (
              <>
                {!showCreateForm && tags.length > 0 && <CommandSeparator />}
                <div className="tag-combobox-create-section">
                  {!showCreateForm ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setShowCreateForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t("tasks.createNewTag") || "Crear nueva etiqueta"}
                    </Button>
                  ) : (
                    <div className="p-3 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold">
                          {t("tasks.createNewTag") || "Crear nueva etiqueta"}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            setShowCreateForm(false);
                            setNewTagName("");
                            setSelectedColor(TAG_COLORS[0].value);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">
                          {t("tasks.tagName") || "Nombre"}
                        </label>
                        <Input
                          type="text"
                          placeholder={
                            t("tasks.tagNamePlaceholder") || "ej. Importante"
                          }
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          className="h-8"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleCreateTag();
                            } else if (e.key === "Escape") {
                              setShowCreateForm(false);
                              setNewTagName("");
                            }
                          }}
                          autoFocus
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">
                          {t("tasks.selectColor") || "Color"}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {TAG_COLORS.map((color) => (
                            <Tooltip key={color.value}>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className={cn(
                                    "h-7 w-7 rounded-md border-2 transition-all hover:scale-110",
                                    selectedColor === color.value
                                      ? "border-primary ring-2 ring-primary/20"
                                      : "border-transparent hover:border-muted-foreground/20"
                                  )}
                                  style={{ backgroundColor: color.value }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedColor(color.value);
                                  }}
                                >
                                  {selectedColor === color.value && (
                                    <Check className="h-4 w-4 text-white drop-shadow-md m-auto" />
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>{color.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {color.value}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => {
                            setShowCreateForm(false);
                            setNewTagName("");
                            setSelectedColor(TAG_COLORS[0].value);
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          {t("tasks.cancel") || "Cancelar"}
                        </Button>
                        <Button
                          onClick={handleCreateTag}
                          disabled={isCreating || !newTagName.trim()}
                          size="sm"
                          className="flex-1"
                        >
                          {isCreating ? (
                            t("tasks.creating") || "Creando..."
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              {t("tasks.create") || "Crear"}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {/* Diálogo de edición */}
      <Dialog
        open={!!editingTag}
        onOpenChange={(open) => !open && setEditingTag(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("tasks.editTag") || "Editar etiqueta"}</DialogTitle>
            <DialogDescription>
              {t("tasks.editTagDescription") ||
                "Modifica el nombre y color de la etiqueta."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("tasks.tagName") || "Nombre"}
              </label>
              <Input
                type="text"
                placeholder={t("tasks.tagNamePlaceholder") || "ej. Importante"}
                value={editTagName}
                onChange={(e) => setEditTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleEditTag();
                  } else if (e.key === "Escape") {
                    setEditingTag(null);
                  }
                }}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("tasks.selectColor") || "Color"}
              </label>
              <div className="flex flex-wrap gap-2">
                {TAG_COLORS.map((color) => (
                  <Tooltip key={color.value}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "h-8 w-8 rounded-md border-2 transition-all hover:scale-110",
                          editTagColor === color.value
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent hover:border-muted-foreground/20"
                        )}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setEditTagColor(color.value)}
                      >
                        {editTagColor === color.value && (
                          <Check className="h-4 w-4 text-white drop-shadow-md m-auto" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{color.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {color.value}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setEditingTag(null)}
                variant="outline"
                className="flex-1"
              >
                {t("tasks.cancel") || "Cancelar"}
              </Button>
              <Button
                onClick={handleEditTag}
                disabled={isUpdating || !editTagName.trim()}
                className="flex-1"
              >
                {isUpdating ? (
                  t("tasks.updating") || "Actualizando..."
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    {t("tasks.save") || "Guardar"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
