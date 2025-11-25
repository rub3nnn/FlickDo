import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import App from "@/App";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import "./i18n";
import i18n from "i18next"; // { changed code }

// Establece el lang inicial y actualiza cuando cambia
document.documentElement.lang = i18n.language || "en"; // { changed code }
i18n.on &&
  i18n.on("languageChanged", (lng: string) => {
    document.documentElement.lang = lng;
  }); // { changed code }

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <App />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
