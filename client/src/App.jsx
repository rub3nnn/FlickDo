// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import { Sidebar } from "@/components/Sidebar/Sidebar";

function App() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
