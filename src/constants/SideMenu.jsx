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
      to: "/settings",
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
        name: "Menú Admin",
        to: "/",
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
      {
        name: "Agregar usuario",
        to: "/admin/users/register",
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
        name: "Lista de docentes",
        to: "/admin/teachers",
      },
      {
        name: "Agregar docente",
        to: "/admin/teachers/register",
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
        name: "Lista de estudiantes",
        to: "/admin/students",
      },
      {
        name: "Agregar estudiante",
        to: "/admin/students/register",
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
        name: "Lista de materias",
        to: "/admin/subjects",
      },
      {
        name: "Agregar materia",
        to: "/admin/subjects/register",
      },
    ],
  },
];

export const studentOptions = [];

export const teacherOptions = [];

export const tutorOptions = [];

export const secretaryOptions = [];

export const principalOptions = [];

export const viceprincipalOptions = [];

export const academicCoorOptions = [];