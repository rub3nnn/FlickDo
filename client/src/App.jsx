// App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { SidebarProvider } from "./components/ui/sidebar";

function App() {
  const location = useLocation();
  const hideRoutes = ["/login", "/register", "/forgot-password"];

  const shouldShowSidebar = !hideRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowSidebar ? (
        <SidebarProvider>
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </SidebarProvider>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </>
  );
}

export default App;
