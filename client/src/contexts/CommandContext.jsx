// src/contexts/CommandContext.jsx
import { createContext, useContext, useState } from "react";

const CommandContext = createContext({});

export function CommandProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("all"); // 'all', 'lists', 'tasks'
  const [onCreateListCallback, setOnCreateListCallback] = useState(null);

  // Abrir el command con un modo específico
  const openCommand = (commandMode = "all", createListCallback = null) => {
    setMode(commandMode);
    setIsOpen(true);
    if (createListCallback) {
      setOnCreateListCallback(() => createListCallback);
    }
  };

  // Cerrar el command
  const closeCommand = () => {
    setIsOpen(false);
    setOnCreateListCallback(null);
  };

  // Abrir solo para buscar listas
  const openListsSearch = (createListCallback = null) => {
    openCommand("lists", createListCallback);
  };

  // Abrir solo para buscar tareas
  const openTasksSearch = () => {
    openCommand("tasks");
  };

  return (
    <CommandContext.Provider
      value={{
        isOpen,
        mode,
        onCreateListCallback,
        openCommand,
        closeCommand,
        openListsSearch,
        openTasksSearch,
      }}
    >
      {children}
    </CommandContext.Provider>
  );
}

export function useCommand() {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error("useCommand must be used within a CommandProvider");
  }
  return context;
}
