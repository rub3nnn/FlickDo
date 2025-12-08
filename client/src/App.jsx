// App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import LandingPage from "./LandingPage";
import AuthCallback from "./AuthCallback";
import AllTasks from "./AllTasks";
import ListPage from "./ListPage";
import Settings from "./Settings";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { TasksProvider } from "@/contexts/TasksContext";
import { GlobalCommand } from "@/components/GlobalCommand";

function App() {
  const location = useLocation();
  const { user, isInitialized } = useAuth();
  const hideRoutes = ["/", "/login", "/auth/callback"];

  const shouldShowSidebar = user && !hideRoutes.includes(location.pathname);

  // Mostrar loading mientras se inicializa la autenticación
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <GlobalCommand />
      {user ? (
        <TasksProvider>
          <SidebarProvider>
            {shouldShowSidebar && <Sidebar />}
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/all-tasks" element={<AllTasks />} />
              <Route path="/list/:listId" element={<ListPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/login"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </SidebarProvider>
        </TasksProvider>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
}

export default App;
