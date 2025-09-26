import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import HomeTemplate from "./my_templates/HomeTemplate";
import Student from "./pages/student";
import { TOKEN } from "../utils/Config";
import Department from "./pages/Department";
import Major from "./pages/Major";

function App() {
  const ProtectedRoute = () => {
    const token = localStorage.getItem(TOKEN);
    return token ? <Outlet /> : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeTemplate />}>
            <Route index element={<Home />} />
            <Route path="students" element={<Student />} />
            <Route path="departments" element={<Department />} />
            <Route path="majors" element={<Major />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
