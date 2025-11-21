import { Settings, LogOut, Moon, Sun, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

export const UserMenu = ({ darkMode, onToggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { user, profile, isInitialized, signOut } = useAuth();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Obtener iniciales del usuario
  const getUserInitials = () => {
    if (!profile?.first_name && !profile?.last_name) return "U";
    const firstInitial = profile?.first_name?.[0] || "";
    const lastInitial = profile?.last_name?.[0] || "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <div className="sidebar-footer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="user-menu-button">
            {isInitialized && user ? (
              <>
                <div className="user-avatar">{getUserInitials()}</div>
                <div className="user-info">
                  <p className="user-name">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="user-email">{user?.email}</p>
                </div>
                <ChevronDown
                  className={`icon-sm chevron ${isOpen ? "rotated" : ""}`}
                />
              </>
            ) : (
              <>
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="user-info flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-4" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="center">
          <DropdownMenuLabel>{t("userMenu.myAccount")}</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>
              {t("userMenu.myProfile")}
              <DropdownMenuShortcut>
                {t("userMenu.notAvailable")}
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>{t("userMenu.settings")}</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {t("userMenu.theme")}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuLabel>
                    {t("userMenu.themeStyle")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={setTheme}
                  >
                    <DropdownMenuRadioItem value="dark">
                      {t("userMenu.dark")}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="light">
                      {t("userMenu.light")}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      {t("userMenu.system")}
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {t("userMenu.language")}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuLabel>
                    {t("userMenu.chooseLanguage")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={i18n.language}
                    onValueChange={changeLanguage}
                  >
                    <DropdownMenuRadioItem value="es">
                      {t("userMenu.spanish")}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="en">
                      {t("userMenu.english")}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="fr" disabled>
                      {t("userMenu.french")}
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            {t("userMenu.logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Esto sería si no utilizara la librería de DropdownMenu
      isOpen && (
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
      )
      */}
    </div>
  );
};
