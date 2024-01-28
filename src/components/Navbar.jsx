import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { FaUserCircle, FaShieldAlt, FaChalkboardTeacher } from "react-icons/fa";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoMdSettings,
  IoIosSpeedometer,
  IoIosArrowUp,
} from "react-icons/io";
import { BsMortarboardFill } from "react-icons/bs";
import { BiBookReader } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";
import Logo from "@images-logos/logo-nombre.png";
import { adminOptions } from "@constants/SideMenu";

function Navbar() {
  const { user } = useAuth();
  const [showMenuUser, setShowMenuUser] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [subMenuSelect, setSubMenuSelect] = useState("");
  const [subOptionSelect, setSubOptionSelect] = useState("");
  const menuRef = useRef(null);
  const location = useLocation();

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenuUser(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleShowSubMenu = (menu) => {
    if (subMenuSelect === menu) return setSubMenuSelect("");
    setSubMenuSelect(menu);
  };

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/admin/control")) {
      setSubMenuSelect("Panel de control");
    } else if (path.startsWith("/admin/users")) {
      setSubMenuSelect("Gestión de usuarios");
      setSubOptionSelect("Lista de usuarios");
    } else {
      setSubMenuSelect("");
    }
  }, [location.pathname]);

  return (
    <div className="w-full h-screen overflow-hidden">
      <header className="bg-white h-[70px] flex flex-row p-2 w-full justify-between">
        <img src={Logo} alt="Logo del sistema" className="" />
        <section
          className="flex flex-row items-center gap-3 relative mr-5"
          ref={menuRef}
        >
          <div className="rounded-full border-2 border-gray-300 p-2">
            <FaUserCircle color="gray" size="1.5em" />
          </div>
          <section className="flex flex-col">
            <h1 className="font-semibold font-sans">{user.firstname}</h1>
            <h2 className="text-[#5855ff] text-sm">{user.role.name}</h2>
          </section>
          <IoIosArrowDown
            onClick={() => setShowMenuUser((prev) => !prev)}
            className="cursor-pointer"
            size="1.3em"
          />
          <AnimatePresence>
            {showMenuUser && (
              <motion.ul
                className="absolute right-0 top-[60px] min-w-[200px] shadow-md rounded-sm p-1 z-20"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
              >
                <li className="hover:bg-blue-300 hover:text-white cursor-pointer p-1 rounded-md">
                  opcion1
                </li>
                <li className="hover:bg-blue-300 hover:text-white cursor-pointer p-1 rounded-md">
                  opcion2
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </section>
      </header>
      <section className="w-full h-full flex flex-row gap-0 overflow-hidden relative bg-[#f7f7f9]">
        <AnimatePresence>
          {showSideBar ? (
            <motion.div
              className="max-w-[300px] w-full flex flex-col gap-5 font-serif border p-5 relative bg-white"
              initial={{ x: -70 }}
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
              {adminOptions.map((option, index) => (
                <Fragment key={index}>
                  {option.mainOption.to ? (
                    <Link
                      className={`flex items-center gap-5 text-lg text-gray-600 bg-white rounded-lg p-2 ${
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
                            className="bg-blue-700 absolute w-[8px] h-[50px] -left-[21px] -top-1 rounded-e-md"
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
            <footer className="h-[50px] w-full absolute bottom-11">COPYRIGHT © 2024 SISADESC.</footer>

            </motion.div>
          ) : (
            <motion.button
              className="bg-white px-2 py-3 absolute top-[20px] left-0 shadow-md rounded-e-lg hover:bg-gray-100"
              onClick={() => setShowSideBar(true)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <IoIosArrowForward />
            </motion.button>
          )}
        </AnimatePresence>
        <section className="w-full h-full overflow-hidden bg-[#f7f7f9]">
          <motion.div initial={{x: 100}} animate={{x: 0}} exit={{x: 100}} className="w-full h-full">
            <Outlet />
          </motion.div>
        </section>
      </section>
    </div>
  );
}

export default Navbar;
