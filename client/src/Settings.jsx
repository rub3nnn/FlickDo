import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/contexts/AuthContext";
import { usersApi } from "@/services/api";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";
import "@/styles/components/Settings.css";
import { Header } from "@/components/Header/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  GraduationCap,
  CheckCircle2,
  Github,
  CalendarCheck,
  ExternalLink,
  Unlink,
  XCircle,
  User,
  KeyRound,
  Mail,
  Bell,
  Palette,
  Globe,
  Shield,
  Trash2,
  Save,
  Moon,
  Sun,
  Monitor,
  Languages,
} from "lucide-react";
import { set } from "date-fns";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { user, profile } = useContext(AuthContext);
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState("account");
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [disconnectAccountDialog, setDisconnectAccountDialog] = useState(false);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  // Account settings state
  const [accountData, setAccountData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    tasks: false,
    collaboration: false,
    dailySummary: false,
  });

  // Load user data from context
  useEffect(() => {
    if (profile && user) {
      setAccountData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: user.email || "",
      });
      setNotificationSettings(
        profile.preferences || {
          tasks: false,
          collaboration: false,
          dailySummary: false,
        }
      );
    }
  }, [profile, user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Connected accounts - Coming soon
  const [connectedAccounts, setConnectedAccounts] = useState([]);

  const [integrations, setIntegrations] = useState([
    {
      id: "google-classroom",
      name: t("settings.integrations.googleClassroom.name"),
      description: t("settings.integrations.googleClassroom.description"),
      icon: GraduationCap,
      available: false,
      connected: false,
      color: "text-green-600",
      bgColor: "bg-green-50",
      darkBgColor: "dark:bg-green-950",
      provider: "google",
      permissions: [
        "Leer y crear tareas de Google Classroom",
        "Acceder a la lista de tus clases",
        "Sincronizar fechas de entrega",
      ],
    },
    {
      id: "google-tasks",
      name: t("settings.integrations.googleTasks.name"),
      description: t("settings.integrations.googleTasks.description"),
      icon: CalendarCheck,
      available: false,
      connected: false,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      darkBgColor: "dark:bg-blue-950",
      provider: "google",
      permissions: [
        "Leer y modificar tus tareas de Google Tasks",
        "Crear nuevas listas de tareas",
        "Sincronización bidireccional",
      ],
    },
    {
      id: "github",
      name: t("settings.integrations.github.name"),
      description: t("settings.integrations.github.description"),
      icon: Github,
      available: false,
      connected: false,
      color: "text-gray-800",
      bgColor: "bg-gray-50",
      darkBgColor: "dark:bg-gray-900",
      provider: "github",
      permissions: [
        "Leer issues de tus repositorios",
        "Crear y actualizar issues",
        "Acceder a información de proyectos",
      ],
    },
  ]);

  const handleConnect = async (integration) => {
    setSelectedIntegration(integration);
    setConfigDialogOpen(true);
  };

  const handleConfirmConnect = async () => {
    setIsConnecting(true);

    try {
      if (selectedIntegration.provider === "google") {
        const authUrl = `${import.meta.env.VITE_API_URL}/auth/google/classroom`;
        window.location.href = authUrl;
      } else if (selectedIntegration.provider === "github") {
        const authUrl = `${import.meta.env.VITE_API_URL}/auth/github`;
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error("Error connecting:", error);
    } finally {
      setIsConnecting(false);
      setConfigDialogOpen(false);
    }
  };

  const handleDisconnect = (integration) => {
    setSelectedIntegration(integration);
    setDisconnectDialogOpen(true);
  };

  const handleConfirmDisconnect = async () => {
    try {
      setIntegrations((prev) =>
        prev.map((int) =>
          int.id === selectedIntegration.id ? { ...int, connected: false } : int
        )
      );

      setConnectedAccounts((prev) =>
        prev.map((account) => ({
          ...account,
          integrations: account.integrations.filter(
            (intId) => intId !== selectedIntegration.id
          ),
        }))
      );
    } catch (error) {
      console.error("Error disconnecting:", error);
    } finally {
      setDisconnectDialogOpen(false);
      setSelectedIntegration(null);
    }
  };

  const handleDisconnectAccount = (account) => {
    setSelectedAccount(account);
    setDisconnectAccountDialog(true);
  };

  const handleConfirmDisconnectAccount = async () => {
    try {
      // Remover la cuenta y desconectar todas sus integraciones
      setConnectedAccounts((prev) =>
        prev.filter((acc) => acc.id !== selectedAccount.id)
      );

      setIntegrations((prev) =>
        prev.map((int) =>
          selectedAccount.integrations.includes(int.id)
            ? { ...int, connected: false }
            : int
        )
      );
    } catch (error) {
      console.error("Error disconnecting account:", error);
    } finally {
      setDisconnectAccountDialog(false);
      setSelectedAccount(null);
    }
  };

  const getProviderInfo = (provider) => {
    switch (provider) {
      case "google":
        return {
          name: "Google",
          color: "bg-blue-500",
          icon: "https://www.google.com/favicon.ico",
        };
      case "github":
        return {
          name: "GitHub",
          color: "bg-gray-900 dark:bg-gray-700",
          icon: "https://github.com/favicon.ico",
        };
      default:
        return {
          name: provider,
          color: "bg-gray-500",
          icon: null,
        };
    }
  };

  const getAccountInitials = (name, email) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email[0].toUpperCase();
  };

  const handleSaveProfile = async () => {
    if (!accountData.firstName.trim() || !accountData.lastName.trim()) {
      toast.error("El nombre y apellido son requeridos");
      return;
    }

    setIsSavingProfile(true);
    try {
      const response = await usersApi.updateProfile(
        accountData.firstName,
        accountData.lastName,
        notificationSettings
      );

      if (response.success) {
        toast.success("Perfil actualizado correctamente");
      }
    } catch (error) {
      toast.error(error.message || "Error al actualizar el perfil");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePreferences = async () => {
    setIsSavingProfile(true);
    try {
      const response = await usersApi.updateProfile(
        accountData.firstName,
        accountData.lastName,
        notificationSettings
      );

      if (response.success) {
        toast.success("Preferencias actualizadas correctamente");
      }
    } catch (error) {
      toast.error(error.message || "Error al actualizar las preferencias");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Todos los campos son requeridos");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await usersApi.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (response.success) {
        toast.success("Contraseña cambiada correctamente");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error.message || "Error al cambiar la contraseña");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteAccountDialog(true);
  };

  const handleConfirmDeleteAccount = async () => {
    const expectedPhrase = `DELETE MY ACCOUNT PERMANENTLY - ${user?.email}`;

    if (deleteConfirmationText !== expectedPhrase) {
      toast.error("La frase de confirmación no coincide");
      return;
    }

    setIsDeletingAccount(true);
    try {
      const response = await usersApi.deleteAccount(deleteConfirmationText);

      if (response.success) {
        toast.success("Tu cuenta ha sido eliminada permanentemente");
        // Clear auth and redirect
        localStorage.removeItem("auth_token");
        window.location.href = "/";
      }
    } catch (error) {
      toast.error(error.message || "Error al eliminar la cuenta");
    } finally {
      setIsDeletingAccount(false);
      setDeleteAccountDialog(false);
      setDeleteConfirmationText("");
    }
  };

  return (
    <>
      <main className="main-content settings-main">
        <Header />

        <div className="settings-container">
          <div className="settings-inner">
            {/* Settings Sidebar Navigation */}
            <aside className="settings-sidebar">
              <div className="settings-sidebar-header">
                <h1 className="settings-sidebar-title">Configuración</h1>
                <p className="settings-sidebar-description">
                  Gestiona tu cuenta y preferencias
                </p>
              </div>

              <nav className="settings-nav">
                <button
                  className="settings-nav-item"
                  data-state={activeTab === "account" ? "active" : "inactive"}
                  onClick={() => setActiveTab("account")}
                >
                  <User className="settings-nav-icon" />
                  <span className="settings-nav-label">Cuenta</span>
                </button>
                <button
                  className="settings-nav-item"
                  data-state={
                    activeTab === "integrations" ? "active" : "inactive"
                  }
                  onClick={() => setActiveTab("integrations")}
                >
                  <Unlink className="settings-nav-icon" />
                  <span className="settings-nav-label">Integraciones</span>
                </button>
                <button
                  className="settings-nav-item"
                  data-state={
                    activeTab === "preferences" ? "active" : "inactive"
                  }
                  onClick={() => setActiveTab("preferences")}
                >
                  <Palette className="settings-nav-icon" />
                  <span className="settings-nav-label">Preferencias</span>
                </button>
              </nav>
            </aside>

            {/* Settings Content */}
            <div className="settings-content">
              <div className="settings-content-inner">
                {/* Account Section */}
                <div
                  className="settings-section"
                  data-state={activeTab === "account" ? "active" : "inactive"}
                >
                  <div className="settings-section-header">
                    <h2 className="settings-section-title">Cuenta</h2>
                    <p className="settings-section-description">
                      Administra tu información personal, seguridad y
                      configuración de cuenta
                    </p>
                  </div>

                  <div className="settings-grid settings-grid-2col">
                    {/* Profile Card */}
                    <Card className="settings-grid-item-full">
                      <CardHeader className="profile-card-header">
                        <CardTitle className="profile-card-title">
                          <User className="icon-sm" />
                          Información del Perfil
                        </CardTitle>
                        <CardDescription className="profile-card-description">
                          Gestiona tu información personal y datos de contacto
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="profile-card-content">
                        {/* Avatar Inline */}
                        <div className="profile-avatar-inline">
                          <Avatar className="profile-avatar">
                            <AvatarImage
                              src={profile?.avatar_url}
                              alt={`${accountData.firstName} ${accountData.lastName}`}
                            />
                            <AvatarFallback className="profile-avatar-fallback">
                              {getAccountInitials(
                                `${accountData.firstName} ${accountData.lastName}`,
                                accountData.email
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="profile-avatar-info">
                            <p className="profile-avatar-name">
                              {accountData.firstName} {accountData.lastName}
                            </p>
                            <p className="profile-avatar-email">
                              {accountData.email}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="profile-change-photo-btn"
                            disabled
                          >
                            Cambiar foto
                          </Button>
                        </div>

                        {/* Form Section */}
                        <div className="profile-form-section">
                          <div className="profile-form-row">
                            <div className="profile-form-group">
                              <Label
                                htmlFor="firstName"
                                className="profile-label"
                              >
                                <User className="profile-label-icon" />
                                Nombre
                              </Label>
                              <Input
                                id="firstName"
                                value={accountData.firstName}
                                onChange={(e) =>
                                  setAccountData({
                                    ...accountData,
                                    firstName: e.target.value,
                                  })
                                }
                                className="profile-input"
                                placeholder="Tu nombre"
                              />
                            </div>
                            <div className="profile-form-group">
                              <Label
                                htmlFor="lastName"
                                className="profile-label"
                              >
                                <User className="profile-label-icon" />
                                Apellido
                              </Label>
                              <Input
                                id="lastName"
                                value={accountData.lastName}
                                onChange={(e) =>
                                  setAccountData({
                                    ...accountData,
                                    lastName: e.target.value,
                                  })
                                }
                                className="profile-input"
                                placeholder="Tu apellido"
                              />
                            </div>
                          </div>
                          <div className="profile-form-group">
                            <Label htmlFor="email" className="profile-label">
                              <Mail className="profile-label-icon" />
                              Correo electrónico
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={accountData.email}
                              disabled
                              className="profile-input"
                            />
                            <p className="profile-hint">
                              El email no se puede cambiar
                            </p>
                          </div>
                        </div>

                        <div className="profile-actions">
                          <Button
                            onClick={handleSaveProfile}
                            className="profile-save-btn"
                            size="sm"
                            disabled={isSavingProfile}
                          >
                            <Save className="icon-sm" />
                            {isSavingProfile
                              ? "Guardando..."
                              : "Guardar cambios"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Security Card */}
                    <Card>
                      <CardHeader className="profile-card-header">
                        <CardTitle className="profile-card-title">
                          <Shield className="icon-sm" />
                          Seguridad
                        </CardTitle>
                        <CardDescription className="profile-card-description">
                          Gestiona tu contraseña y seguridad de la cuenta
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="security-card-content">
                        <div className="security-form-group">
                          <Label
                            htmlFor="current-password"
                            className="security-label"
                          >
                            <KeyRound className="profile-label-icon" />
                            Contraseña actual
                          </Label>
                          <Input
                            id="current-password"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                            className="security-input"
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="security-form-group">
                          <Label
                            htmlFor="new-password"
                            className="security-label"
                          >
                            Nueva contraseña
                          </Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            className="security-input"
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="security-form-group">
                          <Label
                            htmlFor="confirm-password"
                            className="security-label"
                          >
                            Confirmar contraseña
                          </Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="security-input"
                            placeholder="••••••••"
                          />
                        </div>

                        <div className="security-actions">
                          <Button
                            onClick={handleChangePassword}
                            className="security-btn"
                            size="sm"
                            disabled={isChangingPassword}
                          >
                            <KeyRound className="icon-sm" />
                            {isChangingPassword
                              ? "Cambiando..."
                              : "Cambiar contraseña"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="danger-zone-card settings-grid-item-full">
                      <CardHeader className="profile-card-header">
                        <CardTitle className="profile-card-title danger-zone-title">
                          <Trash2 className="icon-sm" />
                          Zona de peligro
                        </CardTitle>
                        <CardDescription className="profile-card-description">
                          Acciones irreversibles que afectarán permanentemente
                          tu cuenta
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="danger-zone-content">
                          <div className="danger-zone-info">
                            <p className="danger-zone-info-title">
                              <XCircle className="danger-zone-info-icon" />
                              Eliminar cuenta
                            </p>
                            <p className="danger-zone-info-description">
                              Esta acción es permanente y no se puede deshacer.
                              Se eliminarán todos tus datos, tareas y
                              configuraciones.
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            className="danger-zone-btn"
                            size="sm"
                          >
                            <Trash2 className="icon-sm" />
                            Eliminar cuenta permanentemente
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Integrations Section */}
                <div
                  className="settings-section"
                  data-state={
                    activeTab === "integrations" ? "active" : "inactive"
                  }
                >
                  <div className="settings-section-header">
                    <h2 className="settings-section-title">Integraciones</h2>
                    <p className="settings-section-description">
                      Conecta tu cuenta con servicios externos para sincronizar
                      tareas y datos
                    </p>
                  </div>

                  <div className="settings-grid settings-grid-full">
                    {/* Connected Accounts - Coming Soon */}
                    <Card>
                      <CardHeader className="profile-card-header">
                        <CardTitle className="profile-card-title">
                          <User className="icon-sm" />
                          Cuentas Conectadas
                          <Badge
                            variant="secondary"
                            className="integration-coming-soon-badge"
                          >
                            Próximamente
                          </Badge>
                        </CardTitle>
                        <CardDescription className="profile-card-description">
                          Pronto podrás conectar múltiples cuentas de Google,
                          GitHub y más
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="connected-accounts-empty">
                          <User className="connected-accounts-empty-icon" />
                          <p className="connected-accounts-empty-text">
                            Esta funcionalidad estará disponible próximamente
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Available Integrations */}
                    <div className="integrations-grid">
                      {integrations.map((integration) => {
                        const Icon = integration.icon;
                        return (
                          <Card
                            key={integration.id}
                            className={`integration-card ${
                              !integration.available
                                ? "integration-card-disabled"
                                : ""
                            }`}
                          >
                            <CardHeader className="integration-card-header">
                              <div className="integration-header-content">
                                <div
                                  className={`integration-icon-wrapper ${
                                    integration.id === "google-classroom"
                                      ? "integration-icon-green"
                                      : integration.id === "google-tasks"
                                      ? "integration-icon-blue"
                                      : "integration-icon-gray"
                                  }`}
                                >
                                  <Icon className="integration-icon" />
                                </div>
                                <div className="integration-info">
                                  <div className="integration-title-row">
                                    <CardTitle className="integration-title">
                                      {integration.name}
                                    </CardTitle>
                                    {integration.connected && (
                                      <CheckCircle2 className="integration-connected-icon" />
                                    )}
                                    {!integration.available && (
                                      <Badge
                                        variant="secondary"
                                        className="integration-coming-soon-badge"
                                      >
                                        Próximamente
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="integration-card-content">
                              <CardDescription className="integration-description">
                                {integration.description}
                              </CardDescription>
                              {integration.available &&
                                (integration.connected ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDisconnect(integration)
                                    }
                                    className="integration-btn"
                                  >
                                    <Unlink className="icon-sm" />
                                    Desconectar
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => handleConnect(integration)}
                                    className="integration-btn"
                                  >
                                    <ExternalLink className="icon-sm" />
                                    Conectar
                                  </Button>
                                ))}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div
                  className="settings-section"
                  style={{
                    width: "100%",
                  }}
                  data-state={
                    activeTab === "preferences" ? "active" : "inactive"
                  }
                >
                  <div className="settings-section-header">
                    <h2 className="settings-section-title">Preferencias</h2>
                    <p className="settings-section-description">
                      Personaliza la apariencia y el comportamiento de la
                      aplicación
                    </p>
                  </div>

                  <div className="settings-grid settings-grid-2col">
                    {/* Personalization */}
                    <Card>
                      <CardHeader className="profile-card-header">
                        <CardTitle className="profile-card-title">
                          <Palette className="icon-sm" />
                          Personalización
                        </CardTitle>
                        <CardDescription className="profile-card-description">
                          Ajusta la apariencia y el idioma
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="personalization-content">
                        {/* Language Selector */}
                        <div className="personalization-section">
                          <Label
                            htmlFor="language"
                            className="personalization-label"
                          >
                            <Languages className="icon-sm" />
                            Idioma
                          </Label>
                          <Select
                            value={i18n.language}
                            onValueChange={(value) => {
                              i18n.changeLanguage(value);
                            }}
                          >
                            <SelectTrigger
                              id="language"
                              className="language-select"
                            >
                              <SelectValue placeholder="Selecciona un idioma" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="es">
                                <div className="language-option">
                                  <span className="language-flag">🇪🇸</span>
                                  <span>Español</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="en">
                                <div className="language-option">
                                  <span className="language-flag">🇬🇧</span>
                                  <span>English</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="personalization-hint">
                            Selecciona el idioma de la interfaz.
                          </p>
                        </div>

                        <Separator />

                        {/* Theme Selector */}
                        <div className="personalization-section">
                          <Label className="personalization-label">
                            <Palette className="icon-sm" />
                            Tema
                          </Label>
                          <div className="theme-selector">
                            <Button
                              variant={
                                theme === "light" ? "default" : "outline"
                              }
                              onClick={() => setTheme("light")}
                              className="theme-btn"
                            >
                              <Sun className="theme-icon" />
                              <span className="theme-label">Claro</span>
                            </Button>
                            <Button
                              variant={theme === "dark" ? "default" : "outline"}
                              onClick={() => setTheme("dark")}
                              className="theme-btn"
                            >
                              <Moon className="theme-icon" />
                              <span className="theme-label">Oscuro</span>
                            </Button>
                            <Button
                              variant={
                                theme === "system" ? "default" : "outline"
                              }
                              onClick={() => setTheme("system")}
                              className="theme-btn"
                            >
                              <Monitor className="theme-icon" />
                              <span className="theme-label">Sistema</span>
                            </Button>
                          </div>
                          <p className="personalization-hint">
                            Elige tu preferencia de color.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card>
                      <CardHeader className="profile-card-header">
                        <CardTitle className="profile-card-title">
                          <Bell className="icon-sm" />
                          Notificaciones
                        </CardTitle>
                        <CardDescription className="profile-card-description">
                          Gestiona cómo recibes notificaciones
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Task Notifications */}
                          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                            <div className="flex-1 space-y-1">
                              <Label
                                htmlFor="notifications-tasks"
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                Notificaciones de tareas
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Recibe alertas sobre tus tareas pendientes
                              </p>
                            </div>
                            <Switch
                              id="notifications-tasks"
                              checked={notificationSettings.tasks}
                              onCheckedChange={(checked) => {
                                setNotificationSettings({
                                  ...notificationSettings,
                                  tasks: checked,
                                });
                              }}
                            />
                          </div>

                          {/* Collaboration Notifications */}
                          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                            <div className="flex-1 space-y-1">
                              <Label
                                htmlFor="notifications-collaboration"
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                Notificaciones de colaboración
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Cuando alguien te asigna una tarea
                              </p>
                            </div>
                            <Switch
                              id="notifications-collaboration"
                              checked={notificationSettings.collaboration}
                              onCheckedChange={(checked) => {
                                setNotificationSettings({
                                  ...notificationSettings,
                                  collaboration: checked,
                                });
                              }}
                            />
                          </div>

                          {/* Daily Summary */}
                          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                            <div className="flex-1 space-y-1">
                              <Label
                                htmlFor="notifications-summary"
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                Resumen diario
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Recibe un resumen de tus tareas cada mañana
                              </p>
                            </div>
                            <Switch
                              id="notifications-summary"
                              checked={notificationSettings.dailySummary}
                              onCheckedChange={(checked) => {
                                setNotificationSettings({
                                  ...notificationSettings,
                                  dailySummary: checked,
                                });
                              }}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={handleSaveProfile}
                          className="profile-save-btn"
                          style={{ marginTop: "10px" }}
                          size="sm"
                          disabled={isSavingProfile}
                        >
                          <Save className="icon-sm" />
                          {isSavingProfile ? "Guardando..." : "Guardar cambios"}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dialog de Configuración/Conexión */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {t("settings.integrations.connectDialog.title", {
                name: selectedIntegration?.name,
              })}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {t("settings.integrations.connectDialog.description")}
            </DialogDescription>
          </DialogHeader>

          {selectedIntegration &&
            selectedIntegration.permissions.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    {t("settings.integrations.connectDialog.permissions")}
                  </h4>
                  <ul className="space-y-2">
                    {selectedIntegration.permissions.map(
                      (permission, index) => (
                        <li key={index} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {permission}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("settings.integrations.connectDialog.redirectInfo")}
                  </p>
                </div>
              </div>
            )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfigDialogOpen(false)}
              className="flex-1 sm:flex-initial"
            >
              {t("settings.integrations.connectDialog.cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleConfirmConnect}
              disabled={isConnecting}
              className="flex-1 sm:flex-initial"
            >
              {isConnecting
                ? t("settings.integrations.connectDialog.connecting")
                : t("settings.integrations.connectDialog.continue")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Desconexión de Integración */}
      <AlertDialog
        open={disconnectDialogOpen}
        onOpenChange={setDisconnectDialogOpen}
      >
        <AlertDialogContent className="sm:max-w-[440px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              {t("settings.integrations.disconnectDialog.title", {
                name: selectedIntegration?.name,
              })}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              {t("settings.integrations.disconnectDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1 sm:flex-initial">
              {t("settings.integrations.disconnectDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDisconnect}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex-1 sm:flex-initial"
            >
              {t("settings.integrations.disconnectDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Desconexión de Cuenta */}
      <AlertDialog
        open={disconnectAccountDialog}
        onOpenChange={setDisconnectAccountDialog}
      >
        <AlertDialogContent className="sm:max-w-[440px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              Desconectar cuenta
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              ¿Estás seguro de que deseas desconectar {selectedAccount?.email}?
              Esto desactivará todas las integraciones asociadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1 sm:flex-initial">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDisconnectAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex-1 sm:flex-initial"
            >
              Desconectar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Eliminación de Cuenta */}
      <AlertDialog
        open={deleteAccountDialog}
        onOpenChange={(open) => {
          setDeleteAccountDialog(open);
          if (!open) {
            setDeleteConfirmationText("");
          }
        }}
      >
        <AlertDialogContent className="sm:max-w-[540px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-destructive">
              Eliminar cuenta permanentemente
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed space-y-3">
              <p>
                Esta acción es <strong>irreversible</strong>. Se eliminarán
                todos tus datos, tareas, listas y configuraciones.
              </p>
              <p>Para confirmar, escribe exactamente la siguiente frase:</p>
              <code className="block bg-muted p-2 rounded text-xs break-all">
                DELETE MY ACCOUNT PERMANENTLY - {user?.email}
              </code>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label
              htmlFor="delete-confirmation"
              className="text-sm font-medium"
            >
              Frase de confirmación
            </Label>
            <Input
              id="delete-confirmation"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="Escribe la frase exacta"
              className="mt-2"
            />
          </div>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1 sm:flex-initial">
              Cancelar
            </AlertDialogCancel>
            <Button
              onClick={handleConfirmDeleteAccount}
              disabled={
                isDeletingAccount ||
                deleteConfirmationText !==
                  `DELETE MY ACCOUNT PERMANENTLY - ${user?.email}`
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex-1 sm:flex-initial"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeletingAccount ? "Eliminando..." : "Eliminar definitivamente"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
