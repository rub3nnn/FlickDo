import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import App from "@/App";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { CommandProvider } from "@/contexts/CommandContext";
import { Toaster } from "@/components/ui/sonner";
import "./i18n";
import i18n from "i18next";

// Establece el lang inicial y actualiza cuando cambia
document.documentElement.lang = i18n.language || "en";
i18n.on &&
  i18n.on("languageChanged", (lng: string) => {
    document.documentElement.lang = lng;
  });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CommandProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <App />
            <Toaster />
          </ThemeProvider>
        </CommandProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
