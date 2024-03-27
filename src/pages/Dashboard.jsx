import { Link, Outlet } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDashboard } from "../hooks/useDashboard";
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
import Logo from "../assets/logos/logo-escudo.png";

function Dashboard() {
  const {
    handleClickOutside,
    handleLogout,
    handleShowSubMenu,
    menuRef,
    setShowMenuUser,
    setShowSideBar,
    showMenuUser,
    showSideBar,
    subMenuSelect,
    subOptionSelect,
    userRole,
    user,
  } = useDashboard();

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-full overflow-hidden relative">
      <Toaster position="top-right" reverseOrder={false} />
      <header className="bg-white h-[70px] flex flex-row p-2 w-full justify-between">
        <div className="flex flex-row items-center gap-3">
          <img src={Logo} alt="Logo del sistema" className="h-full" />
          <h1 className="font-bold text-3xl">SISADESC</h1>
        </div>
        <section
          className="flex flex-row items-center gap-3 relative mr-5"
          ref={menuRef}
        >
          {user.imageperfile ? (
            <div className="rounded-full border-2 border-gray-300 p-1">
              <img
                src={user.imageperfile}
                alt="Image del perfil del usuario"
                className="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full"
              />
            </div>
          ) : (
            <div className="rounded-full border-2 border-gray-300 p-2">
              <FaUserCircle color="gray" size="1.5em" />
            </div>
          )}
          <section className="flex flex-col">
            <h1 className="font-semibold font-sans">{user.firstname}</h1>
            <h2 className="text-[#5855ff] text-sm">{userRole}</h2>
          </section>
          <IoIosArrowDown
            onClick={() => setShowMenuUser((prev) => !prev)}
            className="cursor-pointer"
            size="1.3em"
          />
          <AnimatePresence>
            {showMenuUser && (
              <motion.ul
                className="absolute right-0 top-[60px] min-w-[150px] shadow-md rounded-sm p-1 z-20"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
              >
                <li className="flex">
                  <Link
                    to="/perfile"
                    className="p-1 w-full hover:bg-blue-300 hover:text-white cursor-pointer rounded-md"
                  >
                    Perfil
                  </Link>
                </li>
                <li className="hover:bg-blue-300 hover:text-white cursor-pointer p-1 rounded-md">
                  <button
                    className="w-full h-full text-start"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </section>
      </header>
      <section className="w-full max-h-[calc(100vh-70px)] h-full flex flex-row gap-0 overflow-hidden bg-[#f7f7f9]">
        <AnimatePresence>
          {showSideBar ? (
            <motion.div
              className="max-w-[300px] w-full flex flex-col gap-5 font-serif px-5 pt-5 relative bg-white overflow-y-auto overflow-x-hidden"
              animate={{ x: 0 }}
              exit={{ x: -70 }}
              transition={{ type: "tween" }}
            >
              <section className="flex justify-between text-gray-400 items-center text-xl">
                <h1 className="">Menú principal</h1>
                <button
                  onClick={() => setShowSideBar(false)}
                  className="font-sans"
                >
                  X
                </button>
              </section>
              {(user.role.name === "admin"
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
              ).map((option, index) => (
                <Fragment key={index}>
                  {option.mainOption.to ? (
                    <Link
                      className={`flex items-center gap-5 text-lg bg-white rounded-lg p-2 relative ${
                        subMenuSelect === option.mainOption.name
                          ? "text-blue-700"
                          : "text-gray-600"
                      }`}
                      to={`${option.mainOption.to}`}
                      onClick={() => handleShowSubMenu(option.mainOption.name)}
                      key={index}
                    >
                      {subMenuSelect === option.mainOption.name
                        ? option.mainOption.iconS
                        : option.mainOption.icon}
                      {option.mainOption.name}
                      {subMenuSelect === option.mainOption.name ? (
                        <motion.div
                          className="bg-blue-700 absolute w-[8px] h-[50px] -left-[21px] -top-1 rounded-e-md pointer-events-none"
                          transition={{ delay: 0.2 }}
                          layoutId="sideline"
                        />
                      ) : null}
                    </Link>
                  ) : (
                    <>
                      <button
                        className={`flex justify-between items-center text-lg bg-white rounded-lg p-2 z-20 relative ${
                          subMenuSelect === option.mainOption.name
                            ? "text-blue-700"
                            : "text-gray-600"
                        }`}
                        onClick={() =>
                          handleShowSubMenu(option.mainOption.name)
                        }
                      >
                        <div className="flex items-center gap-5">
                          {subMenuSelect === option.mainOption.name
                            ? option.mainOption.iconS
                            : option.mainOption.icon}
                          {option.mainOption.name}
                        </div>
                        {subMenuSelect === option.mainOption.name ? (
                          <IoIosArrowUp color="blue" size="1.2em" />
                        ) : (
                          <IoIosArrowDown color="gray" size="1.2em" />
                        )}
                        {subMenuSelect === option.mainOption.name ? (
                          <motion.div
                            className="bg-blue-700 absolute w-[8px] h-[50px] -left-[21px] -top-1 rounded-e-md pointer-events-none"
                            transition={{ delay: 0.2 }}
                            layoutId="sideline"
                          />
                        ) : null}
                      </button>
                      <AnimatePresence mode="popLayout">
                        <>
                          {subMenuSelect === option.mainOption.name && (
                            <motion.ul
                              className="z-10 flex flex-col"
                              initial={{ y: -50 }}
                              animate={{ y: 0 }}
                              exit={{ y: -50 }}
                            >
                              {option.subOptions.map((subOption, i) => (
                                <Link
                                  to={`${subOption.to}`}
                                  className={`py-2 pr-2 pl-[20px] w-full my-1 hover:bg-[#718bf3] hover:text-white rounded-md ${
                                    subOptionSelect === subOption.name
                                      ? "bg-[#718bf3] text-white"
                                      : "bg-white text-black"
                                  }`}
                                  key={`${option.mainOption.name}-${i}`}
                                >
                                  {subOption.name}
                                </Link>
                              ))}
                            </motion.ul>
                          )}
                        </>
                      </AnimatePresence>
                    </>
                  )}
                </Fragment>
              ))}
              <footer className="h-[50px] w-fit absolute bottom-0 text-gray-600 flex justify-center items-end">
                <p>COPYRIGHT © 2024 SISADESC.</p>
              </footer>
            </motion.div>
          ) : (
            <motion.button
              className="bg-white px-2 py-3 absolute top-[80px] left-0 shadow-md rounded-e-lg hover:bg-gray-100"
              onClick={() => setShowSideBar(true)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <IoIosArrowForward />
            </motion.button>
          )}
        </AnimatePresence>
        <section className="flex-1 overflow-hidden bg-[#f7f7f9] p-10">
          <motion.div
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            exit={{ x: 100 }}
            className="h-full overflow-y-auto flex-1"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#a5a5a5 transparent",
            }}
          >
            <Outlet />
          </motion.div>
        </section>
      </section>
    </div>
  );
}

export default Dashboard;
