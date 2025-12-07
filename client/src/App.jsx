// App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import AuthCallback from "./AuthCallback";
import AllTasks from "./AllTasks";
import ListPage from "./ListPage";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { TasksProvider } from "@/contexts/TasksContext";
import { GlobalCommand } from "@/components/GlobalCommand";

function App() {
  const location = useLocation();
  const { user, isInitialized } = useAuth();
  const hideRoutes = ["/login", "/auth/callback"];

  const shouldShowSidebar = !hideRoutes.includes(location.pathname);
  const shouldRedirect = isInitialized && !user;

  return (
    <>
      <GlobalCommand />
      {!shouldRedirect && shouldShowSidebar ? (
        <TasksProvider>
          <SidebarProvider>
            <Sidebar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/all-tasks" element={<AllTasks />} />
              <Route path="/list/:listId" element={<ListPage />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SidebarProvider>
        </TasksProvider>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
}

export default App;
