import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StrictMode, Suspense } from "react";
import App from "@/App";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import "./i18n";
import { ProfileProvider } from "@/contexts/ProfileContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <AuthProvider>
          <ProfileProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <App />
            </ThemeProvider>
          </ProfileProvider>
        </AuthProvider>
      </BrowserRouter>
    </Suspense>
  </StrictMode>
);
