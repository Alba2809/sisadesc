import { FaShieldAlt, FaChalkboardTeacher, FaUserCheck } from "react-icons/fa";
import { IoMdSettings, IoIosSpeedometer, IoIosChatbubbles } from "react-icons/io";
import { BsMortarboardFill } from "react-icons/bs";
import { BiBookReader, BiSolidBellRing } from "react-icons/bi";
import { RiParentLine } from "react-icons/ri";
import { MdOutlineFilter9Plus } from "react-icons/md";

export const adminOptions = [
  {
    mainOption: {
      name: "Mensajes",
      icon: <IoIosChatbubbles color="gray" size="1.5em" />,
      iconS: <IoIosChatbubbles color="blue" size="1.5em" />,
      to: "/chats",
    },
  },
  {
    mainOption: {
      name: "Avisos",
      icon: <BiSolidBellRing color="gray" size="1.5em" />,
      iconS: <BiSolidBellRing color="blue" size="1.5em" />,
      to: "/posts",
    },
  },
  /* {
    mainOption: {
      name: "Ajustes",
      icon: <IoMdSettings color="gray" size="1.5em" />,
      iconS: <IoMdSettings color="blue" size="1.5em" />,
      to: "/settings",
    },
  }, */
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
      name: "Mensajes",
      icon: <IoIosChatbubbles color="gray" size="1.5em" />,
      iconS: <IoIosChatbubbles color="blue" size="1.5em" />,
      to: "/chats",
    },
  },
  {
    mainOption: {
      name: "Avisos",
      icon: <BiSolidBellRing color="gray" size="1.5em" />,
      iconS: <BiSolidBellRing color="blue" size="1.5em" />,
      to: "/posts",
    },
  },
  {
    mainOption: {
      name: "Asistencias",
      icon: <FaUserCheck color="gray" size="1.5em" />,
      iconS: <FaUserCheck color="blue" size="1.5em" />,
      to: "/teacher/assists",
    },
  },
  {
    mainOption: {
      name: "Calificaciones",
      icon: <MdOutlineFilter9Plus color="gray" size="1.5em" />,
      iconS: <MdOutlineFilter9Plus color="blue" size="1.5em" />,
      to: "/teacher/grades",
    },
  },
];

export const tutorOptions = [];

export const secretaryOptions = [
  {
    mainOption: {
      name: "Docentes",
      icon: <FaChalkboardTeacher color="gray" size="1.5em" />,
      iconS: <FaChalkboardTeacher color="blue" size="1.5em" />,
    },
    subOptions: [
      {
        name: "Lista de docentes",
        to: "/secretary/teachers",
      },
      {
        name: "Agregar docente",
        to: "/secretary/teachers/register",
      },
    ],
  },
  {
    mainOption: {
      name: "Calificaciones",
      icon: <MdOutlineFilter9Plus color="gray" size="1.5em" />,
      iconS: <MdOutlineFilter9Plus color="blue" size="1.5em" />,
    },
    subOptions: [
      {
        name: "Lista de calificaciones",
        to: "/secretary/grades",
      },
      {
        name: "Registrar calificación",
        to: "/secretary/grades/register",
      },
      {
        name: "Editar calificación",
        to: "/secretary/grades/edit",
      },
    ],
  },
  {
    mainOption: {
      name: "Avisos",
      icon: <BiSolidBellRing color="gray" size="1.5em" />,
      iconS: <BiSolidBellRing color="blue" size="1.5em" />,
    },
    subOptions: [
      {
        name: "Lista de avisos",
        to: "/secretary/posts",
      },
      {
        name: "Registrar aviso",
        to: "/secretary/posts/register",
      },
    ],
  },
];

export const principalOptions = [];

export const viceprincipalOptions = [
  {
    mainOption: {
      name: "Docentes",
      icon: <FaChalkboardTeacher color="gray" size="1.5em" />,
      iconS: <FaChalkboardTeacher color="blue" size="1.5em" />,
    },
    subOptions: [
      {
        name: "Lista de docentes",
        to: "/viceprincipal/teachers",
      },
      {
        name: "Agregar docente",
        to: "/viceprincipal/teachers/register",
      },
    ],
  },
  {
    mainOption: {
      name: "Calificaciones",
      icon: <MdOutlineFilter9Plus color="gray" size="1.5em" />,
      iconS: <MdOutlineFilter9Plus color="blue" size="1.5em" />,
    },
    subOptions: [
      {
        name: "Lista de calificaciones",
        to: "/viceprincipal/grades",
      },
      {
        name: "Registrar calificación",
        to: "/viceprincipal/grades/register",
      },
      {
        name: "Editar calificación",
        to: "/viceprincipal/grades/edit",
      },
    ],
  },
  {
    mainOption: {
      name: "Materias",
      icon: <BiBookReader color="gray" size="1.5em" />,
      iconS: <BiBookReader color="blue" size="1.5em" />,
      to: "/viceprincipal/subjects",
    },
  },
  {
    mainOption: {
      name: "Avisos",
      icon: <BiSolidBellRing color="gray" size="1.5em" />,
      iconS: <BiSolidBellRing color="blue" size="1.5em" />,
    },
    subOptions: [
      {
        name: "Lista de avisos",
        to: "/viceprincipal/posts",
      },
      {
        name: "Registrar aviso",
        to: "/viceprincipal/posts/register",
      },
    ],
  },
];

export const academicCoorOptions = [];