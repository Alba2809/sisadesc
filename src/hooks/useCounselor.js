import { toast } from "react-hot-toast";
import {
  createCounselorRequest,
  deleteCounselorRequest,
  getCounselorRequest,
  getCounselorsRequest,
  updateCounselorRequest,
} from "../api/counselor";
import { useState } from "react";

export function useCounselor({ setValue } = {}) {
  const [loading, setLoading] = useState(true);
  const [counselors, setCounselors] = useState([]);
  const [counselorSelected, setCounselorSelected] = useState(null);
  const [dialogDelete, setDialogDelete] = useState(false);
  const [isHoverRow, setIsHoverRow] = useState(null);

  const getCounselors = async () => {
    try {
      setLoading(true);
      const res = await getCounselorsRequest();
      setCounselors(res.data);
    } catch (error) {
      toast.error("Error al obtener los asesores.");
    } finally {
      setLoading(false);
    }
  };

  const getCounselor = async (id) => {
    try {
      setLoading(true);
      const res = await getCounselorRequest(id);
      if(res.data && setValue){
        setValue("counselor_curp", res.data.curp)
        setValue("grade", res.data.grade)
        setValue("group", res.data.group)
      }
      setCounselorSelected(res.data);
    } catch (error) {
      toast.error("Error al obtener el asesor.");
    } finally {
      setLoading(false);
    }
  };

  const createCounselor = async (data) => {
    try {
      setLoading(true);
      const res = await toast.promise(createCounselorRequest(data), {
        loading: "Asignando asesor...",
        success: "¡Asesor asignado!",
        error: "¡Error al asignar asesor!",
      });
      return res;
    } catch (error) {
      let errorFormatted = [];
      if (typeof error.response.data === "object" && error.response.data) {
        errorFormatted = Object.values(error.response.data);
      } else errorFormatted = error.response.data;
      errorFormatted.forEach((error) => toast.error(error));
    } finally {
      setLoading(false);
    }
  };

  const updateCounselor = async (id, data) => {
    try {
      setLoading(true);
      const res = await toast.promise(updateCounselorRequest(id, data), {
        loading: "Actualizando asesor...",
        success: "Asesor actualizado!",
        error: "¡Error al actualizar asesor!",
      });

      return res;
    } catch (error) {
      let errorFormatted = [];
      if (typeof error.response.data === "object" && error.response.data) {
        errorFormatted = Object.values(error.response.data);
      } else errorFormatted = error.response.data;
      errorFormatted.forEach((error) => toast.error(error));
    }
  };

  const handleDialogDelete = (id) => {
    setDialogDelete(true);
    setCounselorSelected(id);
  };

  const handleActionDelete = async (option) => {
    try {
      if (!option || !counselorSelected) return;

      const res = await toast.promise(
        deleteCounselorRequest(counselorSelected),
        {
          loading: "Eliminando asesor...",
          success: "¡Asesor eliminado!",
          error: "¡Error al eliminar asesor!",
        }
      );

      if (res?.statusText === "OK") {
        const newCounselors = counselors.filter(
          (counselor) => counselor.id !== counselorSelected
        );
        setCounselors(newCounselors);
      }
    } catch (error) {
    } finally {
      setDialogDelete(false);
      setCounselorSelected(null);
    }
  };

  const handleGroupChange = (value) => {
    setValue("group", value);
  };

  const handleGradeChange = (value) => {
    setValue("grade", value);
  };

  return {
    loading,
    counselors,
    getCounselors,
    getCounselor,
    createCounselor,
    updateCounselor,
    handleDialogDelete,
    handleActionDelete,
    counselorSelected,
    dialogDelete,
    isHoverRow,
    setIsHoverRow,
    handleGroupChange,
    handleGradeChange,
  };
}
