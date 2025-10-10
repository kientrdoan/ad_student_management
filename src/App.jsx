import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import HomeTemplate from "./my_templates/HomeTemplate";
import { TOKEN } from "../utils/Config";
import Department from "./pages/Department";
import Major from "./pages/Major";
import Student from "./pages/Student";
import Class from "./pages/Class";
import StudentDetail from "./pages/StudentDetail";
import Teacher from "./pages/Teacher";
import TeacherDetail from "./pages/TeacherDetail";
import Course from "./pages/Course";
import Semester from "./pages/Semester";
import Subject from "./pages/Subject";
import SubjectDetail from "./pages/SubjectDetail";
import Room from "./pages/Room";

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
            {/* <Route index element={<Home />} /> */}
            <Route index path="" element={<Department />} />
            <Route path="departments" element={<Department />} />
            <Route path="students" element={<Student />} />
            <Route path="students/detail" element={<StudentDetail />} />
            <Route path="students/detail/:id" element={<StudentDetail />} />
            <Route path="teachers" element={<Teacher></Teacher>} />
            <Route path="teachers/detail" element={<TeacherDetail />} />
            <Route path="teachers/detail/:id" element={<TeacherDetail />} />
            <Route path="majors" element={<Major />} />
            <Route path="class" element={<Class />} />
            <Route path="courses" element={<Course />} />
            <Route path="semesters" element={<Semester />} />

            <Route path="subjects" element={<Subject />} />
            <Route path="subjects/detail" element={<SubjectDetail />} />
            <Route path="subjects/detail/:id" element={<SubjectDetail />} />
            <Route path="rooms" element={<Room />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
