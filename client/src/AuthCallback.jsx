// src/AuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/services/api";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true; // Flag para evitar doble ejecución en Strict Mode

    const handleCallback = async () => {
      try {
        // Obtener los parámetros de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );

        // Verificar si es un callback de OAuth (Google, GitHub, etc.)
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          // Es un callback de OAuth - obtener el JWT del backend
          if (!isMounted) return;

          try {
            // Llamar al backend para obtener/crear el perfil y JWT
            const response = await authApi.handleOAuthCallback(
              accessToken,
              refreshToken
            );

            if (response.success && response.data.token) {
              // Guardar el JWT token
              localStorage.setItem("auth_token", response.data.token);

              // Redirigir inmediatamente sin mostrar mensaje
              navigate("/");
              window.location.reload();
              return;
            }
          } catch (error) {
            console.error("Error en OAuth callback:", error);
            // Si falla, mostrar error
            setStatus("error");
            setMessage("Error al completar la autenticación con Google.");
            return;
          }
        }

        // Intentar obtener token_hash de query params o hash (verificación de email)
        const tokenHash =
          urlParams.get("token_hash") || hashParams.get("token_hash");
        const type = urlParams.get("type") || hashParams.get("type");

        if (type === "signup" && tokenHash) {
          // Verificación de email completada - llamar al backend
          const response = await authApi.verifyEmail(tokenHash, type);

          if (!isMounted) return; // Si el componente se desmontó, no actualizar estado

          if (response.success) {
            const { token, user, profile } = response.data;

            // Guardar el token en localStorage
            localStorage.setItem("auth_token", token);

            setStatus("success");
            setMessage("¡Cuenta verificada exitosamente! Redirigiendo...");

            // Redirigir al home después de 2 segundos
            setTimeout(() => {
              navigate("/");
              window.location.reload(); // Reload para actualizar el contexto de auth
            }, 2000);
          } else {
            setStatus("error");
            setMessage(
              response.message ||
                "Error al verificar tu cuenta. Por favor, intenta de nuevo."
            );
          }
        } else if (type === "recovery") {
          // Recuperación de contraseña
          navigate("/reset-password");
        } else {
          // Otro tipo de callback o error
          setStatus("error");
          setMessage("Enlace de verificación inválido o expirado.");
        }
      } catch (error) {
        console.error("Error en callback:", error);
        if (!isMounted) return; // Si el componente se desmontó, no actualizar estado

        setStatus("error");
        setMessage(
          error.message || "Ocurrió un error durante la verificación."
        );
      }
    };

    handleCallback();

    // Cleanup function para evitar doble ejecución en Strict Mode
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "3rem 2.5rem",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Logo */}
        <img
          src="/logo.png"
          alt="FlickDo Logo"
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 2rem",
            display: "block",
          }}
        />

        {status === "loading" && (
          <>
            <Loader2
              size={48}
              className="mail-icon"
              style={{
                margin: "0 auto 1.5rem",
                color: "#667eea",
                animation: "spin 1s linear infinite",
              }}
            />
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                marginBottom: "0.75rem",
                color: "#1f2937",
              }}
            >
              Verificando tu cuenta...
            </h2>
            <p
              style={{ color: "#6b7280", fontSize: "1rem", lineHeight: "1.6" }}
            >
              Por favor, espera mientras verificamos tu correo electrónico.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2
              size={64}
              style={{
                margin: "0 auto 1.5rem",
                color: "#10b981",
              }}
            />
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                marginBottom: "0.75rem",
                color: "#10b981",
              }}
            >
              ¡Verificación exitosa!
            </h2>
            <p
              style={{ color: "#6b7280", fontSize: "1rem", lineHeight: "1.6" }}
            >
              {message}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle
              size={64}
              style={{
                margin: "0 auto 1.5rem",
                color: "#ef4444",
              }}
            />
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                marginBottom: "0.75rem",
                color: "#ef4444",
              }}
            >
              Error de verificación
            </h2>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "1.5rem",
                fontSize: "1rem",
                lineHeight: "1.6",
              }}
            >
              {message}
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "0.875rem 2.5rem",
                borderRadius: "0.5rem",
                border: "none",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 6px rgba(102, 126, 234, 0.3)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 12px rgba(102, 126, 234, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px rgba(102, 126, 234, 0.3)";
              }}
            >
              Volver al inicio de sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}
