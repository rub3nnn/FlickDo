// App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

function App() {
  const location = useLocation();
  const { user, isInitialized } = useAuth();
  const hideRoutes = ["/login"];

  const shouldShowSidebar = !hideRoutes.includes(location.pathname);
  const shouldRedirect = isInitialized && !user;

  return (
    <>
      {!shouldRedirect && shouldShowSidebar ? (
        <SidebarProvider>
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SidebarProvider>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
}

export default App;
