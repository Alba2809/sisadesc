import { FaShieldAlt, FaChalkboardTeacher, FaUserCheck } from "react-icons/fa";
import { IoMdSettings, IoIosSpeedometer } from "react-icons/io";
import { BsMortarboardFill } from "react-icons/bs";
import { BiBookReader } from "react-icons/bi";
import { RiParentLine } from "react-icons/ri";

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
      name: "Padres/Tutores",
      icon: <RiParentLine color="gray" size="1.5em" />,
      iconS: <RiParentLine color="blue" size="1.5em" />,
    },
    subOptions: [
      {
        name: "Lista de padres",
        to: "/admin/parents",
      },
      {
        name: "Agregar padre",
        to: "/admin/parents/register",
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

export const studentOptions = [
  
];

export const teacherOptions = [
  {
    mainOption: {
      name: "Asistencias",
      icon: <FaUserCheck color="gray" size="1.5em" />,
      iconS: <FaUserCheck color="blue" size="1.5em" />,
    },
    subOptions: [
      {
        name: "Lista de asistencia",
        to: "/teacher/assists",
      },
      {
        name: "Registrar asistencia",
        to: "/teacher/assists/register",
      },
    ],
  },
];

export const tutorOptions = [];

export const secretaryOptions = [];

export const principalOptions = [];

export const viceprincipalOptions = [];

export const academicCoorOptions = [];