import { Menu, Search, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";

export const Header = ({ onToggleSidebar }) => {
  const { t } = useTranslation();
  const { toggleSidebar } = useSidebar();
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="menu-button mobile-only" onClick={toggleSidebar}>
            <Menu className="icon-md" />
          </button>

          <div>
            <h1 className="header-title">{t("header.welcome")}</h1>
            <p className="header-subtitle">{t("header.date")}</p>
          </div>
        </div>

        <div className="header-right">
          <div className="search-container desktop-only">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder={t("header.search")}
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
