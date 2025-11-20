import { Settings, LogOut, Moon, Sun, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";
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

export const UserMenu = ({ darkMode, onToggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="sidebar-footer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="user-menu-button">
            <div className="user-avatar">MC</div>
            <div className="user-info">
              <p className="user-name">María Chuchumeca</p>
              <p className="user-email">chuchumeca@gmail.com</p>
            </div>
            <ChevronDown
              className={`icon-sm chevron ${isOpen ? "rotated" : ""}`}
            />
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
          <DropdownMenuItem>{t("userMenu.logout")}</DropdownMenuItem>
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
