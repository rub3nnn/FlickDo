import { Menu, Search, Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Header = ({ onToggleSidebar }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <SidebarTrigger>
            <button className="menu-button mobile-only">
              <Menu className="icon-md" />
            </button>
          </SidebarTrigger>

          <div>
            <h1 className="header-title">Bienvenida, María</h1>
            <p className="header-subtitle">Martes, 18 de Noviembre 2025</p>
          </div>
        </div>

        <div className="header-right">
          <div className="search-container desktop-only">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Buscar..."
              className="search-input"
            />
          </div>

          <button className="icon-button mobile-only">
            <Search className="icon-md" />
          </button>

          <button className="icon-button notification-button">
            <Bell className="icon-md" />
            <span className="notification-dot" />
          </button>
        </div>
      </div>
    </header>
  );
};
