import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import Dashboard from "@pages/Dashboard";
import Login from "@pages/Login";
import AuthValidator from "@components/auth/AuthValidator";
import RolValidator from "@components/auth/RolValidator";
import RegisterUser from "@components/admin/User/RegisterUser";
import Users from "@components/admin/User/Users";
import MainSection from "@components/MainSection";
import EditUser from "@components/admin/User/EditUser";
import Teachers from "@components/admin/Teacher/Teachers";
import Settings from "@components/Settings";
import RegisterTeacher from "@components/admin/Teacher/RegisterTeacher";
import EditTeacher from "@components/admin/Teacher/EditTeacher";
import Students from "@components/admin/Student/Students";
import EditStudent from "@components/admin/Student/EditStudent";
import RegisterStudent from "@components/admin/Student/RegisterStudent";
import Subjects from "@components/admin/Subject/Subjects";
import EditSubject from "@components/admin/Subject/EditSubject";
import RegisterSubject from "@components/admin/Subject/RegisterSubject";
import Perfile from "@components/Perfile";

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<AuthValidator />}>
        <Route element={<Dashboard />}>
          <Route path="/" element={<MainSection />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/perfile" element={<Perfile />} />

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
              <Route path="subjects/*">
                <Route path="" element={<Subjects />} />
                <Route path="edit/:id" element={<EditSubject />} />
                <Route path="register" element={<RegisterSubject />} />
                <Route path="*" element={<Navigate to="/admin/subjects" />} />
              </Route>
              <Route path="*" element={<Navigate to="/admin/teachers" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="teacher" />}>
            <Route path="/teacher/*" element={<AdminProvider />}> {/* Cambiar el context */}
              
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="student" />}>
            <Route path="/student/*" element={<AdminProvider />}> {/* Cambiar el context */}
              
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="tutor" />}>
            <Route path="/tutor/*" element={<AdminProvider />}> {/* Cambiar el context */}
              
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="secretary" />}>
            <Route path="/secretary/*" element={<AdminProvider />}> {/* Cambiar el context */}
              
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="principal" />}>
            <Route path="/principal/*" element={<AdminProvider />}> {/* Cambiar el context */}
              
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="viceprincipal" />}>
            <Route path="/viceprincipal/*" element={<AdminProvider />}> {/* Cambiar el context */}
              
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
