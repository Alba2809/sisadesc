import { FaShieldAlt, FaChalkboardTeacher } from "react-icons/fa";
import { IoMdSettings, IoIosSpeedometer } from "react-icons/io";
import { BsMortarboardFill } from "react-icons/bs";
import { BiBookReader } from "react-icons/bi";

export const adminOptions = [
  {
    mainOption: {
      name: "Ajustes",
      icon: <IoMdSettings color="gray" size="1.5em" />,
      iconS: <IoMdSettings color="blue" size="1.5em" />,
      to: "#",
    },
  },
  {
    mainOption: {
      name: "Panel de control",
      icon: <IoIosSpeedometer color="gray" size="1.5em" />,
      iconS: <IoIosSpeedometer color="blue" size="1.5em" />,
    },
    subOptions: [
      {
        name: "Opción control 1",
        to: "#",
      },
      {
        name: "Opción control 2",
        to: "#",
      },
    ],
  },
  {
    mainOption: {
      name: "Gestión de usuarios",
      icon: <FaShieldAlt color="gray" size="1.5em" />,
      iconS: <FaShieldAlt color="blue" size="1.5em" />,
    },
    subOptions: [
      {
        name: "Lista de usuarios",
        to: "/admin/users",
      },
    ],
  },
  {
    mainOption: {
      name: "Docentes",
      icon: <FaChalkboardTeacher color="gray" size="1.5em" />,
      iconS: <FaChalkboardTeacher color="blue" size="1.5em" />,
    },
    subOptions: [
      {
        name: "Opción docentes 1",
        to: "#",
      },
      {
        name: "Opción docentes 2",
        to: "#",
      },
    ],
  },
  {
    mainOption: {
      name: "Estudiantes",
      icon: <BsMortarboardFill color="gray" size="1.5em" />,
      iconS: <BsMortarboardFill color="blue" size="1.5em" />,
    },
    subOptions: [
      {
        name: "Opción estudiantes 1",
        to: "#",
      },
      {
        name: "Opción estudiantes 2",
        to: "#",
      },
    ],
  },
  {
    mainOption: {
      name: "Materias",
      icon: <BiBookReader color="gray" size="1.5em" />,
      iconS: <BiBookReader color="blue" size="1.5em" />,
    },
    subOptions: [
      {
        name: "Opción materias 1",
        to: "#",
      },
      {
        name: "Opción materias 2",
        to: "#",
      },
    ],
  },
];
