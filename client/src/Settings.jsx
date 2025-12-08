import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/contexts/AuthContext";
import { usersApi } from "@/services/api";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  // Load user data from context
  useEffect(() => {
    if (profile && user) {
      setAccountData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: user.email || "",
      });
    }
  }, [profile, user]);

  const [notificationSettings, setNotificationSettings] = useState({
    tasks: true,
    collaboration: true,
    dailySummary: false,
  });

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
        accountData.lastName
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

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
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
      <main className="main-content flex flex-col h-screen overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                {t("settings.title")}
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5">
                {t("settings.description")}
              </p>
            </div>

            {/* Tabs Navigation */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 -mx-4 px-4">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid h-11">
                  <TabsTrigger value="account" className="gap-2 data-[state=active]:bg-background">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Cuenta</span>
                  </TabsTrigger>
                  <TabsTrigger value="integrations" className="gap-2 data-[state=active]:bg-background">
                    <Unlink className="h-4 w-4" />
                    <span className="hidden sm:inline">Integraciones</span>
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="gap-2 data-[state=active]:bg-background">
                    <Palette className="h-4 w-4" />
                    <span className="hidden sm:inline">Preferencias</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Account Tab */}
              <TabsContent value="account" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Profile Card */}
                  <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Información del Perfil
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Gestiona tu información personal y datos de contacto
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex flex-col items-center gap-3">
                          <Avatar className="h-24 w-24 border-2 border-muted">
                            <AvatarImage
                              src={profile?.avatar_url}
                              alt={`${accountData.firstName} ${accountData.lastName}`}
                            />
                            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-primary/10">
                              {getAccountInitials(
                                `${accountData.firstName} ${accountData.lastName}`,
                                accountData.email
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <Button variant="outline" size="sm" className="text-xs" disabled>
                            Cambiar foto
                          </Button>
                          <p className="text-xs text-muted-foreground text-center">
                            No disponible
                          </p>
                        </div>
                        <Separator orientation="vertical" className="hidden md:block h-auto" />
                        <div className="grid gap-4 flex-1 w-full">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="firstName" className="text-sm font-medium flex items-center gap-2">
                                <User className="h-3.5 w-3.5" />
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
                                className="h-10"
                                placeholder="Tu nombre"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="lastName" className="text-sm font-medium flex items-center gap-2">
                                <User className="h-3.5 w-3.5" />
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
                                className="h-10"
                                placeholder="Tu apellido"
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5" />
                              Correo electrónico
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={accountData.email}
                              disabled
                              className="h-10"
                            />
                            <p className="text-xs text-muted-foreground">
                              El email no se puede cambiar
                            </p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleSaveProfile}
                          className="gap-2 h-10"
                          size="sm"
                          disabled={isSavingProfile}
                        >
                          <Save className="h-4 w-4" />
                          {isSavingProfile ? "Guardando..." : "Guardar cambios"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security Card */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Seguridad
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Gestiona tu contraseña y seguridad de la cuenta
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="current-password" className="text-sm font-medium flex items-center gap-2">
                            <KeyRound className="h-3.5 w-3.5" />
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
                            className="h-10"
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="new-password" className="text-sm font-medium">Nueva contraseña</Label>
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
                            className="h-10"
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="confirm-password" className="text-sm font-medium">
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
                            className="h-10"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <Separator />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleChangePassword}
                          className="gap-2 h-10"
                          size="sm"
                          disabled={isChangingPassword}
                        >
                          <KeyRound className="h-4 w-4" />
                          {isChangingPassword ? "Cambiando..." : "Cambiar contraseña"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Danger Zone */}
                  <Card className="border-destructive/50 bg-destructive/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" />
                        Zona de peligro
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Acciones irreversibles que afectarán permanentemente tu cuenta
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4 p-4 border border-destructive/50 rounded-lg bg-background hover:bg-destructive/5 transition-colors">
                        <div className="space-y-1">
                          <p className="font-semibold text-sm flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-destructive" />
                            Eliminar cuenta
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Esta acción es permanente y no se puede deshacer. Se eliminarán todos tus datos, tareas y configuraciones.
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          className="gap-2 w-full h-10"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar cuenta permanentemente
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Integrations Tab */}
              <TabsContent value="integrations" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Connected Accounts - Coming Soon */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Cuentas Conectadas
                        <Badge variant="secondary" className="ml-2">Próximamente</Badge>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Pronto podrás conectar múltiples cuentas de Google, GitHub y más
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <User className="h-12 w-12 text-muted-foreground/50 mb-3" />
                        <p className="text-sm text-muted-foreground">
                          Esta funcionalidad estará disponible próximamente
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Available Integrations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {integrations.map((integration) => {
                      const Icon = integration.icon;
                      return (
                        <Card
                          key={integration.id}
                          className={`transition-all hover:shadow-md ${
                            !integration.available ? "opacity-60" : "hover:border-accent"
                          }`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                  className={`p-2.5 rounded-lg ${integration.bgColor} ${integration.darkBgColor} ${integration.color}`}
                                >
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <CardTitle className="text-sm truncate">
                                      {integration.name}
                                    </CardTitle>
                                    {integration.connected && (
                                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                    )}
                                  </div>
                                  {!integration.available && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs h-5 px-2"
                                    >
                                      Próximamente
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <CardDescription className="text-xs line-clamp-2 min-h-[2.5rem]">
                              {integration.description}
                            </CardDescription>
                            {integration.available &&
                              (integration.connected ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDisconnect(integration)}
                                  className="w-full h-9 gap-2"
                                >
                                  <Unlink className="h-4 w-4" />
                                  Desconectar
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleConnect(integration)}
                                  className="w-full h-9 gap-2"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Conectar
                                </Button>
                              ))}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Personalization */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Personalización
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Ajusta la apariencia y el idioma
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Language Selector */}
                      <div className="space-y-3">
                        <Label htmlFor="language" className="text-sm font-medium flex items-center gap-2">
                          <Languages className="h-4 w-4" />
                          Idioma
                        </Label>
                        <Select
                          value={i18n.language}
                          onValueChange={(value) => {
                            i18n.changeLanguage(value);
                          }}
                        >
                          <SelectTrigger id="language" className="h-10">
                            <SelectValue placeholder="Selecciona un idioma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="es">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🇪🇸</span>
                                <span>Español</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="en">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🇬🇧</span>
                                <span>English</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Selecciona el idioma de la interfaz.
                        </p>
                      </div>

                      <Separator />

                      {/* Theme Selector */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          Tema
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={theme === "light" ? "default" : "outline"}
                            onClick={() => setTheme("light")}
                            className="justify-center h-20 flex-col gap-2"
                          >
                            <Sun className="h-5 w-5" />
                            <span className="text-xs">Claro</span>
                          </Button>
                          <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            onClick={() => setTheme("dark")}
                            className="justify-center h-20 flex-col gap-2"
                          >
                            <Moon className="h-5 w-5" />
                            <span className="text-xs">Oscuro</span>
                          </Button>
                          <Button
                            variant={theme === "system" ? "default" : "outline"}
                            onClick={() => setTheme("system")}
                            className="justify-center h-20 flex-col gap-2"
                          >
                            <Monitor className="h-5 w-5" />
                            <span className="text-xs">Sistema</span>
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Elige tu preferencia de color.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notifications */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notificaciones
                      </CardTitle>
                      <CardDescription className="text-xs">
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
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                tasks: checked,
                              })
                            }
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
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                collaboration: checked,
                              })
                            }
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
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                dailySummary: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
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
                Esta acción es <strong>irreversible</strong>. Se eliminarán todos
                tus datos, tareas, listas y configuraciones.
              </p>
              <p>
                Para confirmar, escribe exactamente la siguiente frase:
              </p>
              <code className="block bg-muted p-2 rounded text-xs break-all">
                DELETE MY ACCOUNT PERMANENTLY - {user?.email}
              </code>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="delete-confirmation" className="text-sm font-medium">
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
              disabled={isDeletingAccount || deleteConfirmationText !== `DELETE MY ACCOUNT PERMANENTLY - ${user?.email}`}
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
