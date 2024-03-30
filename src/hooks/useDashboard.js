import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    adminOptions,
    studentOptions,
    teacherOptions,
    tutorOptions,
    secretaryOptions,
    principalOptions,
    viceprincipalOptions,
    academicCoorOptions,
  } from "../constants/SideMenu";

export function useDashboard() {
  const { user, logout, getUser } = useAuth();
  const [showMenuUser, setShowMenuUser] = useState(false);
  const [showSideBar, setShowSideBar] = useState(true);
  const [subMenuSelect, setSubMenuSelect] = useState("");
  const [subOptionSelect, setSubOptionSelect] = useState("");
  const userRole =
    user.role.name === "admin"
      ? "Administrador"
      : user.role.name === "student"
      ? "Estudiante"
      : user.role.name === "teacher"
      ? "Profesor"
      : user.role.name === "tutor"
      ? "Tutor/Padre"
      : user.role.name === "secretary"
      ? "Secretaria"
      : user.role.name === "principal"
      ? "Director"
      : user.role.name === "viceprincipal"
      ? "Subdirector"
      : user.role.name === "academiccoor"
      ? "Coordinador"
      : user.role.name === "counselor"
      ? "Asesor"
      : "Invitado";
  const menuRef = useRef(null);
  const location = useLocation();

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenuUser(false);
    }
  };

  const handleLogout = () => logout();

  const handleShowSubMenu = (menu) => {
    setSubMenuSelect(menu);
  };

  useLayoutEffect(() => {
    const path = location.pathname;
    const parts = path.split("/").filter(Boolean);
    const lastPart = parts[parts.length - 2];
    const preLastPart = parts[parts.length - 3];
    const withoutLastPart = "/" + parts.slice(0, -2).join("/");
    const withoutPreLastPart = "/" + parts.slice(0, -3).join("/");

    const matchingOption = (
      user.role.name === "admin"
        ? adminOptions
        : user.role.name === "student"
        ? studentOptions
        : user.role.name === "teacher"
        ? teacherOptions
        : user.role.name === "tutor"
        ? tutorOptions
        : user.role.name === "secretary"
        ? secretaryOptions
        : user.role.name === "principal"
        ? principalOptions
        : user.role.name === "viceprincipal"
        ? viceprincipalOptions
        : user.role.name === "academiccoor"
        ? academicCoorOptions
        : []
    )
      .map((option) => {
        if (option.mainOption.to === path) {
          return { mainOptionName: option.mainOption.name };
        }

        if (option.subOptions) {
          const subOption = option.subOptions.find(
            (subOption) =>
              subOption.to ===
              (lastPart
                ? lastPart === "edit"
                  ? withoutLastPart
                  : preLastPart === "edit"
                  ? withoutPreLastPart
                  : path
                : path)
          );
          return subOption
            ? { mainOptionName: option.mainOption.name, subOption }
            : null;
        }

        return null;
      })
      .filter((matchingOption) => matchingOption)[0];

    if (matchingOption) {
      setSubMenuSelect(matchingOption.mainOptionName);
      if (matchingOption.subOption)
        setSubOptionSelect(matchingOption.subOption.name);
    } else {
      setSubMenuSelect("");
      setSubOptionSelect("");
    }
  }, [location.pathname]);

  useEffect(() => {
    getUser();
  }, []);

  return {
    user,
    userRole,
    showMenuUser,
    showSideBar,
    subMenuSelect,
    subOptionSelect,
    handleLogout,
    handleShowSubMenu,
    menuRef,
    handleClickOutside,
    handleShowSubMenu,
    setShowMenuUser,
    setShowMenuUser,
    setShowSideBar,
    setSubMenuSelect,
    setSubOptionSelect,    
  };
}
