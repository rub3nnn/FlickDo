import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// Componente de Login
const LoginPage = ({ onSwitchToSignup }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn, signInWithProvider } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Credenciales incorrectas. Verifica tu email y contraseña.");
        } else {
          setError(error.message);
        }
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intenta de nuevo.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const { error } = await signInWithProvider("google");
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("Error al iniciar sesión con Google.");
      console.error("Google login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const { error } = await signInWithProvider("github");
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("Error al iniciar sesión con GitHub.");
      console.error("GitHub login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo-large">
            <img src="/logo.png" alt="FlickDo Logo" className="auth-logo-img" />
            <span className="logo-text-auth">FlickDo</span>
          </div>
          <p className="auth-tagline">{t("auth.tagline")}</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">{t("auth.login.title")}</h2>
            <p className="auth-subtitle">{t("auth.login.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#fee2e2",
                  border: "1px solid #fca5a5",
                  borderRadius: "8px",
                  color: "#991b1b",
                  fontSize: "14px",
                  marginBottom: "16px",
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">{t("auth.login.email")}</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder={t("auth.login.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t("auth.login.password")}</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="icon-sm" />
                  ) : (
                    <Eye className="icon-sm" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                {/*<input type="checkbox" className="checkbox-input" />
                <span className="checkbox-text">Recordarme</span>*/}
              </label>
              <button type="button" className="link-button">
                {t("auth.login.forgotPassword")}
              </button>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              <span>
                {loading ? "Iniciando sesión..." : t("auth.login.loginButton")}
              </span>
              <ArrowRight className="icon-sm" />
            </button>

            <div className="divider">
              <span className="divider-text">
                {t("auth.login.orContinueWith")}
              </span>
            </div>

            <div className="social-buttons">
              <button
                type="button"
                className="btn-social"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="icon-md" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="btn-social"
                onClick={handleGithubLogin}
                disabled={loading}
              >
                <svg
                  className="icon-md"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              {t("auth.login.noAccount")}{" "}
              <button
                onClick={onSwitchToSignup}
                className="link-button primary"
              >
                {t("auth.login.createAccount")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Signup
const SignupPage = ({ onSwitchToLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp, signInWithProvider } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const { error, requiresEmailVerification, email } = await signUp(
        formData.email,
        formData.password,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
        }
      );

      if (error) {
        if (error.message.includes("already registered")) {
          setError("Este email ya está registrado. Intenta iniciar sesión.");
        } else {
          setError(error.message);
        }
      } else if (requiresEmailVerification) {
        // Mostrar mensaje de verificación
        setRegisteredEmail(email || formData.email);
        setShowVerificationMessage(true);
      } else {
        // Registro exitoso sin verificación (no debería pasar con la nueva config)
        navigate("/");
      }
    } catch (err) {
      setError("Error al crear la cuenta. Intenta de nuevo.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const { error } = await signInWithProvider("google");
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("Error al registrarse con Google.");
      console.error("Google signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const { error } = await signInWithProvider("github");
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("Error al registrarse con GitHub.");
      console.error("GitHub signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo-large">
            <img src="/logo.png" alt="FlickDo Logo" className="auth-logo-img" />
            <span className="logo-text-auth">FlickDo</span>
          </div>
          <p className="auth-tagline">{t("auth.taglineSignup")}</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          {showVerificationMessage ? (
            // Mensaje de verificación de email
            <div className="verification-message-container">
              <div className="verification-icon">
                <Mail size={64} className="mail-icon" />
              </div>
              <h2 className="verification-title">
                ¡Revisa tu correo electrónico!
              </h2>
              <p className="verification-text">
                Hemos enviado un correo de verificación a{" "}
                <strong>{registeredEmail}</strong>
              </p>
              <p className="verification-instructions">
                Por favor, abre el enlace en el correo para verificar tu cuenta
                y acceder automáticamente a FlickDo.
              </p>
              <div className="verification-tips">
                <p className="verification-tip">
                  <CheckCircle2 size={16} /> El enlace expira en 24 horas
                </p>
                <p className="verification-tip">
                  <CheckCircle2 size={16} /> Revisa tu carpeta de spam si no lo
                  ves
                </p>
              </div>
              <button
                onClick={() => {
                  setShowVerificationMessage(false);
                  onSwitchToLogin();
                }}
                className="btn-primary"
                style={{ marginTop: "24px" }}
              >
                Ir al inicio de sesión
              </button>
            </div>
          ) : (
            // Formulario de registro
            <>
              <div className="auth-header">
                <h2 className="auth-title">{t("auth.signup.title")}</h2>
                <p className="auth-subtitle">{t("auth.signup.subtitle")}</p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                {error && (
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#fee2e2",
                      border: "1px solid #fca5a5",
                      borderRadius: "8px",
                      color: "#991b1b",
                      fontSize: "14px",
                      marginBottom: "16px",
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <div className="input-wrapper">
                      <User className="input-icon" />
                      <input
                        type="text"
                        name="firstName"
                        className="form-input"
                        placeholder="Tu nombre"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Apellido</label>
                    <div className="input-wrapper">
                      <User className="input-icon" />
                      <input
                        type="text"
                        name="lastName"
                        className="form-input"
                        placeholder="Tu apellido"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t("auth.signup.email")}</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder={t("auth.signup.emailPlaceholder")}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {t("auth.signup.password")}
                  </label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="input-action"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="icon-sm" />
                      ) : (
                        <Eye className="icon-sm" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {t("auth.signup.confirmPassword")}
                  </label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className="form-input"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="input-action"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="icon-sm" />
                      ) : (
                        <Eye className="icon-sm" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      required
                    />
                    <span className="checkbox-text">
                      {t("auth.signup.acceptTerms")}{" "}
                      <button
                        type="button"
                        className="link-button link-button-inline"
                      >
                        {t("auth.signup.termsAndConditions")}
                      </button>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  <span>
                    {loading
                      ? "Creando cuenta..."
                      : t("auth.signup.signupButton")}
                  </span>
                  <ArrowRight className="icon-sm" />
                </button>

                <div className="divider">
                  <span className="divider-text">
                    {t("auth.signup.orSignupWith")}
                  </span>
                </div>

                <div className="social-buttons">
                  <button
                    type="button"
                    className="btn-social"
                    onClick={handleGoogleSignup}
                    disabled={loading}
                  >
                    <svg className="icon-md" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="btn-social"
                    onClick={handleGithubSignup}
                    disabled={loading}
                  >
                    <svg
                      className="icon-md"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    GitHub
                  </button>
                </div>
              </form>

              <div className="auth-footer">
                <p className="auth-footer-text">
                  {t("auth.signup.haveAccount")}{" "}
                  <button
                    onClick={onSwitchToLogin}
                    className="link-button primary"
                  >
                    {t("auth.signup.login")}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// App principal
export default function Login() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {showSignup ? (
        <SignupPage onSwitchToLogin={() => setShowSignup(false)} />
      ) : (
        <LoginPage onSwitchToSignup={() => setShowSignup(true)} />
      )}
    </div>
  );
}
