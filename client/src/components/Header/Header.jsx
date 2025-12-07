import { Menu, Search, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useCommand } from "@/contexts/CommandContext";

export const Header = ({ onToggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const { toggleSidebar } = useSidebar();
  const { profile, loading } = useAuth();
  const { openCommand } = useCommand();

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const dateString = new Intl.DateTimeFormat(i18n.language, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="menu-button mobile-only" onClick={toggleSidebar}>
            <Menu className="icon-md" />
          </button>

          <div>
            <h1
              className="header-title"
              style={profile?.first_name ? { opacity: 1 } : { opacity: 0 }}
            >
              {t("header.greeting", { name: profile?.first_name })}
            </h1>
            <p className="header-subtitle">{capitalizeFirst(dateString)}</p>
          </div>
        </div>

        <div className="header-right">
          <button
            className="search-container desktop-only search-button"
            onClick={() => openCommand("all")}
          >
            <Search className="search-icon" />
            <div className="search-input">{t("header.search")}</div>
          </button>

          <button
            className="icon-button mobile-only"
            onClick={() => openCommand("all")}
          >
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
