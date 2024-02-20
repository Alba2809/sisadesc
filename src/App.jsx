import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import { TeacherProvider } from "@context/TeacherContext";
import { ChatProvider } from "@context/ChatContext";
import Dashboard from "@pages/Dashboard";
import Login from "@pages/Login";
import AuthValidator from "@components/auth/AuthValidator";
import RolValidator from "@components/auth/RolValidator";
import RegisterUser from "@pages/admin/User/RegisterUser";
import Users from "@pages/admin/User/Users";
import MainSection from "@pages/MainSection";
import EditUser from "@pages/admin/User/EditUser";
import Teachers from "@pages/admin/Teacher/Teachers";
import Settings from "@pages/Settings";
import RegisterTeacher from "@pages/admin/Teacher/RegisterTeacher";
import EditTeacher from "@pages/admin/Teacher/EditTeacher";
import Students from "@pages/admin/Student/Students";
import EditStudent from "@pages/admin/Student/EditStudent";
import RegisterStudent from "@pages/admin/Student/RegisterStudent";
import Subjects from "@pages/admin/Subject/Subjects";
import EditSubject from "@pages/admin/Subject/EditSubject";
import RegisterSubject from "@pages/admin/Subject/RegisterSubject";
import Parents from "@pages/admin/Parent/Parents";
import EditParent from "@pages/admin/Parent/EditParent";
import RegisterParent from "@pages/admin/Parent/RegisterParent";
import Perfile from "@pages/Perfile";
import Chats from "@pages/Chat/Chats";
import Assists from "@pages/teacher/SchoolAssists/Assists";
import RegisterAssists from "@pages/teacher/SchoolAssists/RegisterAssists";
import Grades from "@pages/teacher/SchoolGrades/Grades";
import RegisterGrades from "@pages/teacher/SchoolGrades/RegisterGrades";

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<AuthValidator />}>
        <Route element={<Dashboard />}>
          <Route path="/" element={<MainSection />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/perfile" element={<Perfile />} />
          <Route element={<ChatProvider />}>

          <Route path="/chats" element={<Chats />} />
          </Route>

          <Route element={<RolValidator rolRoute="admin" />}>
            <Route path="/admin/*" element={<AdminProvider />}>
              <Route path="users/*">
                <Route path="" element={<Users />} />
                <Route path="edit/:id" element={<EditUser />} />
                <Route path="register" element={<RegisterUser />} />
                <Route path="*" element={<Navigate to="/admin/users" />} />
              </Route>
              <Route path="teachers/*">
                <Route path="" element={<Teachers />} />
                <Route path="edit/:id" element={<EditTeacher />} />
                <Route path="register" element={<RegisterTeacher />} />
                <Route path="*" element={<Navigate to="/admin/teachers" />} />
              </Route>
              <Route path="students/*">
                <Route path="" element={<Students />} />
                <Route path="edit/:id" element={<EditStudent />} />
                <Route path="register" element={<RegisterStudent />} />
                <Route path="*" element={<Navigate to="/admin/students" />} />
              </Route>
              <Route path="parents/*">
                <Route path="" element={<Parents />} />
                <Route path="edit/:id" element={<EditParent />} />
                <Route path="register" element={<RegisterParent />} />
                <Route path="*" element={<Navigate to="/admin/parents" />} />
              </Route>
              <Route path="subjects/*">
                <Route path="" element={<Subjects />} />
                <Route path="edit/:id" element={<EditSubject />} />
                <Route path="register" element={<RegisterSubject />} />
                <Route path="*" element={<Navigate to="/admin/subjects" />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="teacher" />}>
            <Route path="/teacher/*" element={<TeacherProvider />}>
              <Route path="assists/*">
                <Route path="" element={<Assists />} />
                <Route path="register" element={<RegisterAssists />} />
                <Route path="*" element={<Navigate to="/teacher/assists" />} />
              </Route>
              <Route path="grades/*">
                <Route path="" element={<Grades />} />
                <Route path="register" element={<RegisterGrades />} />
                <Route path="*" element={<Navigate to="/teacher/grades" />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="student" />}>
            <Route path="/student/*" element={<AdminProvider />}>
              {" "}
              {/* Cambiar el context */}
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="tutor" />}>
            <Route path="/tutor/*" element={<AdminProvider />}>
              {" "}
              {/* Cambiar el context */}
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="secretary" />}>
            <Route path="/secretary/*" element={<AdminProvider />}>
              {" "}
              {/* Cambiar el context */}
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="principal" />}>
            <Route path="/principal/*" element={<AdminProvider />}>
              {" "}
              {/* Cambiar el context */}
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="viceprincipal" />}>
            <Route path="/viceprincipal/*" element={<AdminProvider />}>
              {" "}
              {/* Cambiar el context */}
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="academiccoor" />}>
            <Route path="/academicoor/*" element={<AdminProvider />}>
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<h1>Not found.</h1>} />
    </Routes>
  );
}

export default App;
