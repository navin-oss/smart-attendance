// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import TeacherLogin from "./pages/TeacherLogin";
import Dashboard from "./pages/Dashboard";
import MarkAttendance from "./pages/MarkAttendance";
import StudentList from "./pages/StudentList";
import { useTheme } from "./theme/ThemeContext";
import Header from "./components/Header";

export default function App() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <Header theme={theme} setTheme={setTheme} />

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/login" element={<TeacherLogin/>}/>
          <Route path="/mark" element={<MarkAttendance/>}/>
          <Route path="/students" element={<StudentList/>}/>
        </Routes>
      </div>
    </div>
  );
}
