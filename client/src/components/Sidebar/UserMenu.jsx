import { Settings, LogOut, Moon, Sun, ChevronDown } from "lucide-react";
import { useState } from "react";

export const UserMenu = ({ darkMode, onToggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sidebar-footer">
      <button onClick={() => setIsOpen(!isOpen)} className="user-menu-button">
        <div className="user-avatar">MC</div>
        <div className="user-info">
          <p className="user-name">María Chuchumeca</p>
          <p className="user-email">chuchumeca@gmail.com</p>
        </div>
        <ChevronDown className={`icon-sm chevron ${isOpen ? "rotated" : ""}`} />
      </button>

      {isOpen && (
        <div className="user-dropdown">
          <button className="dropdown-item">
            <Settings className="icon-sm" />
            Configuración
          </button>
          <button onClick={onToggleDarkMode} className="dropdown-item">
            {darkMode ? (
              <>
                <Sun className="icon-sm" />
                Modo claro
              </>
            ) : (
              <>
                <Moon className="icon-sm" />
                Modo oscuro
              </>
            )}
          </button>
          <button className="dropdown-item danger">
            <LogOut className="icon-sm" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
