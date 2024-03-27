import { useState } from "react";
import {
  deleteTeacherRequest,
  getTeacherRequest,
  getTeachersRequest,
  registerTeacherRequest,
  updateTeacherRequest,
} from "../api/teacher";
import toast from "react-hot-toast";
import { formatDateShort } from "../constants/functions";

export function useTeacher({ setValue } = {}) {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const registerTeacher = async (data) => {
    try {
      const res = await toast.promise(registerTeacherRequest(data), {
        loading: "Registrando docente...",
        success: "¡Docente registrado!",
        error: "¡Error al registrar docente!",
      });
      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  const updateTeacher = async (id, data) => {
    try {
      const res = await toast.promise(updateTeacherRequest(id, data), {
        loading: "Actualizando docente...",
        success: "¡Docente actualizado!",
        error: "¡Error al actualizar!",
      });
      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  const getTeachers = async () => {
    try {
      setLoading(true);
      const res = await getTeachersRequest();
      return res.data;
    } catch (error) {
      toast.error("Error al obtener los docentes.");
    } finally {
      setLoading(false);
    }
  };

  const getTeacher = async (id) => {
    try {
      setLoading(true);
      const res = await getTeacherRequest(id);
      const objectData = res.data;
      if (setValue) {
        setValue("firstname", objectData.firstname);
        setValue("lastnamepaternal", objectData.lastnamepaternal);
        setValue("lastnamematernal", objectData.lastnamematernal);
        setValue("curp", objectData.curp);
        setValue("rfc", objectData.rfc);
        setValue("gender", objectData.gender);
        setValue("phonenumber", objectData.phonenumber);
        setValue("birthdate", formatDateShort(objectData.birthdate));
        setValue("addressid", +objectData.address.id);
        setValue("street", objectData.address.street);
        setValue("colony", objectData.address.settlement);
        setValue("postalcode", objectData.address.postalcode);
      }
      setTeacher(objectData);
      return objectData;
    } catch (error) {
      toast.error("Error al obtener el docente.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTeacher = async (id) => {
    try {
      setLoading(true);
      const res = await toast.promise(deleteTeacherRequest(id), {
        loading: "Eliminando docente...",
        success: "Docente eliminado!",
        error: "¡Error al eliminar!",
      });
      return res;
    } catch (error) {
      toast.error("Error al eliminar el docente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialog = (user) => {
    setTeacherToDelete(user);
    setShowDialog((prev) => !prev);
  };

  const handleChangeInput = (e, name, type) => {
    let value = null;
    if (type === "number") value = e.target.value.replace(/[^0-9]/g, "");
    if (setValue) setValue(name, value ?? e.target.value);
  };

  const handleChangeGender = (value) => {
    if (setValue) setValue("gender", value);
  };

  return {
    loading,
    errors,
    teacher,
    registerTeacher,
    getTeachers,
    getTeacher,
    deleteTeacher,
    handleChangeInput,
    handleChangeGender,
    updateTeacher,
    handleDialog,
    showDialog,
    teacherToDelete,
  };
}
