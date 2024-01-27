import { Routes, Route, useLocation } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AuthValidator from "./components/auth/AuthValidator";
import RolValidator from "./components/auth/RolValidator";
import RegisterUser from "./pages/RegisterUser";

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<AuthValidator />}>
        <Route element={<Navbar />}>
          <Route path="/" element={<Dashboard />} />

          <Route element={<RolValidator rolRoute="admin" />}>
            <Route element={<AdminProvider />}>
              <Route path="/test" element={<RegisterUser />} />
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
