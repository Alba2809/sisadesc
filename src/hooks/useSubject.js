import { useEffect, useState } from "react";
import {
  getSubjectRequest,
  getSubjectStudentsRequest,
  getSubjectsRequest,
  registerSubjectRequest,
  updateStatusSubjectRequest,
  updateSubjectRequest,
} from "../api/subject";
import toast from "react-hot-toast";
import { groupArray } from "../constants/functions";
import { getTeacherRequest } from "../api/teacher";
import { getUserRequest } from "../api/user";

export function useSubject() {
  const [loading, setLoading] = useState(true);
  const [showDialogStatus, setShowDialogStatus] = useState(false);
  const [showDialogView, setShowDialogView] = useState(false);
  const [subjectSelected, setSubjectSelected] = useState(null);
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [counselor, setCounselor] = useState(null);
  const [errors, setErrors] = useState([]);

  const registerSubject = async (data) => {
    try {
      setLoading(true);
      const res = await toast.promise(registerSubjectRequest(data), {
        loading: "Registrando materia...",
        success: "¡Materia registrada!",
        error: "¡Error al registrar materia!",
      });

      return res
    } catch(error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  }

  const getSubjects = async () => {
    try {
      setLoading(true);
      const res = await getSubjectsRequest();
      return res.data;
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener las materias");
    } finally {
      setLoading(false);
    }
  };

  const getSubject = async (subjectId) => {
    try {
      setLoading(true);
      const res = await getSubjectRequest(subjectId);
      setSubjectSelected(res.data);
      return res.data
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener la materia");
    } finally {
      setLoading(false);
    }
  };

  const getSubjectStudents = async (subjectId) => {
    try {
      setLoading(true);
      const res = await getSubjectStudentsRequest(subjectId);
      if (res.data) {
        setStudents(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener los estudiantes");
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async (subjectId, data) => {
    try {
      setLoading(true);
      const res = await toast.promise(updateSubjectRequest(subjectId, data), {
        loading: "Actualizando materia...",
        success: "Materia actualizada!",
        error: "¡Error al actualizar la materia!",
      });
      return res
    } catch (error) {
      console.log(error);
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    } finally{
      setLoading(false)
    }
  }

  const handleStatusObject = async () => {
    try {
      if (!subjectSelected) {
        toast.error("Seleccione una materia");
        return;
      }
      const res = await toast.promise(
        updateStatusSubjectRequest(subjectSelected),
        {
          loading: "Actualizando estado...",
          success: "¡Estado actualizado!",
          error: "¡Error al actualizar el estado!",
        }
      );

      if (res?.status === 200) getSubjects();

      setSubjectSelected(null);
    } catch (error) {
      console.log(error);
    } finally {
      setShowDialogStatus(false);
    }
  };

  const handleDialogStatus = (subject) => {
    setSubjectSelected(subject);
    setShowDialogStatus((prev) => !prev);
  };

  const handleDialogView = (object) => {
    setShowDialogView((prev) => !prev);
    async function getSubjectData() {
      const resStudents = await getSubjectStudentsRequest(object.id);
      setStudents(resStudents?.data);
      if (object.teacher_id) {
        const resTeacher = await getTeacherRequest(object.teacher_id);
        setTeacher(resTeacher?.data);
      }
      if (object.counselor_id) {
        const resCounselor = await getUserRequest(object.counselor_id);
        const counselor = {
          firstname: resCounselor?.data?.firstname,
          lastnamepaternal: resCounselor?.data?.lastnamepaternal,
          lastnamematernal: resCounselor?.data?.lastnamematernal,
          curp: resCounselor?.data?.curp,
        };
        setCounselor(counselor);
      }
    }
    if (object) getSubjectData();
  };

  const handleActionStatus = (accept) => {
    if (!accept) {
      setShowDialogStatus(false);
      setSubjectSelected(null);
      return;
    }
    handleStatusObject();
  };

  const handleCloseView = (close) => {
    setShowDialogView(false);
  };

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
    showDialogStatus,
    showDialogView,
    subjectSelected,
    students,
    teacher,
    counselor,
    getSubject,
    getSubjectStudents,
    getSubjects,
    handleStatusObject,
    handleDialogStatus,
    handleDialogView,
    handleActionStatus,
    handleCloseView,
    registerSubject,
    errors,
    updateSubject,
  };
}
