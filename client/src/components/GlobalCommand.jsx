// src/components/GlobalCommand.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useCommand } from "@/contexts/CommandContext";
import { useLists } from "@/hooks/useLists";
import { useAllTasks } from "@/hooks/useAllTasks";
import { ListTodo, CheckSquare, Plus, Calendar, Tag } from "lucide-react";

export function GlobalCommand() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isOpen, closeCommand, openCommand, mode, onCreateListCallback } =
    useCommand();
  const [inputValue, setInputValue] = useState("");

  // Cargar listas y tareas
  const { lists, loading: listsLoading } = useLists(false, false);
  const { tasks, loading: tasksLoading } = useAllTasks();

  // Log para debugging - verificar estructura de datos
  useEffect(() => {
    console.log("=== GlobalCommand Debug ===");
    console.log("Lists:", lists);
    console.log("Lists length:", lists?.length);
    console.log("Tasks:", tasks);
    console.log("Tasks length:", tasks?.length);
    if (tasks?.length > 0) {
      console.log("First task:", tasks[0]);
    }
    if (lists?.length > 0) {
      console.log("First list:", lists[0]);
    }
  }, [lists, tasks]);

  // Determinar qué mostrar según el modo
  const showLists = mode === "all" || mode === "lists";
  const showTasks = mode === "all" || mode === "tasks";
  const showCreateList = mode === "all" || mode === "lists";

  // Manejar selección de lista
  const handleSelectList = (listId) => {
    navigate(`/list/${listId}`);
    closeCommand();
    setInputValue("");
  };

  // Manejar selección de tarea
  const handleSelectTask = (task) => {
    navigate(`/list/${task.list_id}`);
    closeCommand();
    setInputValue("");
  };

  // Manejar creación de lista
  const handleCreateList = () => {
    if (!inputValue.trim()) return;

    // Si hay un callback, lo usamos para abrir el modal con el título
    if (onCreateListCallback) {
      onCreateListCallback(inputValue.trim());
    }

    closeCommand();
    setInputValue("");
  };

  // Limpiar búsqueda al cerrar
  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
    }
  }, [isOpen]);

  // Atajos de teclado globales
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) {
          closeCommand();
        } else {
          openCommand("all");
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, closeCommand, openCommand]);

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={closeCommand}
      title={t("command.title", "Búsqueda rápida")}
      description={t("command.description", "Busca listas y tareas")}
    >
      <CommandInput
        placeholder={
          mode === "lists"
            ? t("command.searchLists", "Buscar listas...")
            : mode === "tasks"
            ? t("command.searchTasks", "Buscar tareas...")
            : t("command.searchAll", "Buscar listas y tareas...")
        }
        onValueChange={setInputValue}
      />

      <CommandList>
        <CommandEmpty>
          {inputValue && showCreateList ? (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                {t("command.noResults", "No se encontraron resultados")}
              </p>
              <button
                onClick={handleCreateList}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                {t("command.createList", 'Crear lista "{name}"', {
                  name: inputValue,
                })}
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("command.noResults", "No se encontraron resultados")}
            </p>
          )}
        </CommandEmpty>

        {/* Acción de crear lista */}
        {showCreateList && inputValue && (
          <>
            <CommandGroup heading={t("command.actions", "Acciones")}>
              <CommandItem onSelect={handleCreateList}>
                <Plus className="mr-2 h-4 w-4" />
                <span>
                  {t("command.createList", 'Crear lista "{name}"', {
                    name: inputValue,
                  })}
                </span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Listas */}
        {showLists && lists && lists.length > 0 && (
          <>
            <CommandGroup heading={t("command.lists", "Listas")}>
              {lists.map((list) => (
                <CommandItem
                  key={list.id}
                  value={list.title}
                  onSelect={() => handleSelectList(list.id)}
                >
                  <ListTodo
                    className="mr-2 h-4 w-4"
                    style={{ color: list.color }}
                  />
                  <span>{list.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Separador entre listas y tareas */}
        {showLists &&
          showTasks &&
          lists &&
          lists.length > 0 &&
          tasks &&
          tasks.length > 0 && <CommandSeparator />}

        {/* Tareas */}
        {showTasks && tasks && tasks.length > 0 && (
          <CommandGroup heading={t("command.tasks", "Tareas")}>
            {tasks.map((task) => (
              <CommandItem
                key={task.id}
                value={task.title}
                onSelect={() => handleSelectTask(task)}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        task.is_completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    {task.list_name && (
                      <span className="flex items-center gap-1">
                        <ListTodo className="h-3 w-3" />
                        {task.list_name}
                      </span>
                    )}
                    {task.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                    {task.tags && task.tags.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {task.tags.length}
                      </span>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
