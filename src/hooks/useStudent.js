import { useEffect, useState } from "react";
import { deleteStudentRequest, getStudentRequest, getStudentsRequest, registerStudentRequest, updateStudentRequest } from "../api/student";
import toast from "react-hot-toast";
import { formatDateShort } from "../constants/functions";

export function useStudent({ setValue, unregister } = {}) {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showFormNewParent, setShowFormNewParent] = useState(null);
  const [showFormFather, setShowFormFather] = useState(false);
  const [showFormMother, setShowFormMother] = useState(false);
  const [showFormTutor, setShowFormTutor] = useState(false);

  const registerStudent = async (data) => {
    try {
      const res = await toast.promise(registerStudentRequest(data), {
        loading: "Registrando estudiante...",
        success: "¡Estudiante registrado!",
        error: "¡Error al registrar estudiante!",
      });
      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  }

  const updateStudent = async (id, data) => {
    try {
      const res = await toast.promise(updateStudentRequest(id, data), {
        loading: "Actualizando estudiante...",
        success: "¡Estudiante actualizado!",
        error: "¡Error al actualizar!",
      });
      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  }

  const getStudents = async () => {
    try {
      setLoading(true);
      const res = await getStudentsRequest();
      setStudents(res.data);
      return res.data
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener los estudiantes.");
    } finally {
      setLoading(false);
    }
  };

  const getStudent = async (id) => {
    try {
      setLoading(true);
      const res = await getStudentRequest(id);
      const objectData = res.data;
      setStudent(objectData)
      setValue("student_firstname", objectData.firstname);
      setValue("student_lastnamepaternal", objectData.lastnamepaternal);
      setValue("student_lastnamematernal", objectData.lastnamematernal);
      setValue("student_curp", objectData.curp);
      setValue("student_gender", objectData.gender);
      setValue("student_birthdate", formatDateShort(objectData.birthdate));
      setValue("student_street", objectData.address.street);
      setValue("student_colony", objectData.address.settlement);
      setValue("student_addressid", objectData.address.id);
      setValue("student_postalcode", objectData.address.postalcode);
      setValue("student_group", objectData.group);
      setValue("student_grade", objectData.grade?.toString());
      setValue("student_phonenumber", objectData.phonenumber);
      setValue("student_email", objectData.email);
      setValue("father_curp", objectData.father_curp);
      setValue("mother_curp", objectData.mother_curp);
      setValue("tutor_curp", objectData.tutor_curp);
      return res?.data;
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener el estudiante.");
    } finally {
      setLoading(false);
    }
  }

  const deleteStudent = async (id) =>{
    try {
      const res = await toast.promise(deleteStudentRequest(id), {
        loading: "Eliminando estudiante...",
        success: "¡Estudiante eliminado!",
        error: "¡Error al eliminar!",
      });
      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  }

  const handleDialog = (user) => {
    setStudentToDelete(user);
    setShowDialog((prev) => !prev);
  };

  const handleChangeInput = (e, name, type) => {
    let value = null;
    if (type === "number") value = e.target.value.replace(/[^0-9]/g, "");
    setValue(name, value ?? e.target.value);
  };

  const handleChangeSelect = (value, name) => setValue(name, value);

  const handleClickRegister = (e) => {
    if (showFormNewParent !== e.target.value) {
      setShowFormNewParent(e.target.value);
      if (e.target.value === "Yes") {
        setShowFormFather(false);
        setShowFormMother(false);
        setShowFormTutor(false);
      }
    }
  };

  const handleShowForm = (type) => {
    if (type === "father") {
      setShowFormFather((prev) => !prev);
    }
    if (type === "mother") {
      setShowFormMother((prev) => !prev);
    }
    if (type === "tutor") {
      setShowFormTutor((prev) => !prev);
    }
  };

  useEffect(() => {
    if(!unregister) return
    if (!showFormFather) {
      unregister([
        "father_firstname",
        "father_lastnamepaternal",
        "father_lastnamematernal",
        "father_curp",
        "father_rfc",
        "father_birthdate",
        "father_email",
        "father_phonenumber",
        "father_colony",
        "father_postalcode",
        "father_addressid",
        "father_status",
        "father_street",
      ]);
    }
    if (!showFormMother) {
      unregister([
        "mother_firstname",
        "mother_lastnamepaternal",
        "mother_lastnamematernal",
        "mother_curp",
        "mother_rfc",
        "mother_birthdate",
        "mother_email",
        "mother_phonenumber",
        "mother_colony",
        "mother_postalcode",
        "mother_addressid",
        "mother_status",
        "mother_street",
      ]);
    }
    if (!showFormTutor) {
      unregister([
        "tutor_firstname",
        "tutor_lastnamepaternal",
        "tutor_lastnamematernal",
        "tutor_curp",
        "tutor_rfc",
        "tutor_birthdate",
        "tutor_email",
        "tutor_phonenumber",
        "tutor_colony",
        "tutor_postalcode",
        "tutor_addressid",
        "tutor_status",
        "tutor_street",
      ]);
    }
    if (showFormFather && !showFormMother && !showFormTutor)
      setValue("isTutor", "Padre");
    else if (showFormMother && !showFormFather && !showFormTutor)
      setValue("isTutor", "Madre");
    else if (showFormFather && showFormMother && !showFormTutor)
      setValue("isTutor", "Madre");
    else if (!showFormTutor && !showFormFather && !showFormMother)
      unregister(["isTutor"]);
  }, [showFormFather, showFormMother, showFormTutor]);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return {
    loading,
    students,
    errors,
    getStudents,
    deleteStudent,
    handleDialog,
    studentToDelete,
    showDialog,
    handleChangeInput,
    handleChangeSelect,
    handleClickRegister,
    showFormNewParent,
    showFormFather,
    showFormMother,
    showFormTutor,
    handleShowForm,
    registerStudent,
    student,
    getStudent,
    updateStudent
  };
}
