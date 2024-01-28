import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import Navbar from "@components/Navbar";
import Dashboard from "@pages/Dashboard";
import Login from "@pages/Login";
import AuthValidator from "@components/auth/AuthValidator";
import RolValidator from "@components/auth/RolValidator";
import RegisterUser from "@pages/RegisterUser";
import Users from "@pages/admin/Users";

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<AuthValidator />}>
        <Route element={<Navbar />}>
          <Route path="/" element={<Dashboard />} />

          <Route element={<RolValidator rolRoute="admin" />}>
            <Route path="/admin/*" element={<AdminProvider />}>
              <Route path="users/*">
                <Route path="" element={<Users />} />
                <Route path="register" element={<RegisterUser />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Route>
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
