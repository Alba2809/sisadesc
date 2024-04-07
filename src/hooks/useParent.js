import { useState } from "react";
import {
  deleteParentRequest,
  getParentRequest,
  getParentsRequest,
  registerFatherRequest,
  registerMotherRequest,
  registerParentRequest,
  registerTutorRequest,
  updateParentRequest,
} from "../api/parent";
import toast from "react-hot-toast";
import { formatDateShort } from "../utils/functions";

export function useParent({ setValue } = {}) {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [parents, setParents] = useState([]);
  const [parent, setParent] = useState(null);
  const [parentToDelete, setParentToDelete] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const registerParent = async (data, type = "parent") => {
    try {
      let res = null;
      if (type === "father") {
        res = await toast.promise(registerFatherRequest(data), {
          loading: "Registrando padre...",
          success: "¡Padre registrado!",
          error: "¡Error al registrar padre!",
        });
      } else if (type === "mother") {
        res = await toast.promise(registerMotherRequest(data), {
          loading: "Registrando madre...",
          success: "¡Madre registrada!",
          error: "¡Error al registrar madre!",
        });
      } else if (type === "tutor") {
        res = await toast.promise(registerTutorRequest(data), {
          loading: "Registrando tutor...",
          success: "¡Tutor registrado!",
          error: "¡Error al registrar tutor!",
        });
      } else {
        res = await toast.promise(registerParentRequest(data), {
          loading: "Registrando padre...",
          success: "Padre registrado!",
          error: "¡Error al registrar el padre!",
        });
      }
      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  const updateParent = async (id, data) => {
    try {
      const res = await toast.promise(updateParentRequest(id, data), {
        loading: "Actualizando registro...",
        success: "Registro actualizado!",
        error: "¡Error al actualizar el registro!",
      });
      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  const deleteParent = async (id) => {
    try {
      const res = await toast.promise(deleteParentRequest(id), {
        loading: "Eliminando registro realizado...",
        success: "Registro eliminado!",
        error: "¡Error al eliminar el registro!",
      });
      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  const getParents = async () => {
    try {
      setLoading(true);
      const res = await getParentsRequest();
      setParents(res.data);
      return res.data;
    } catch (error) {
      toast.error("Error al obtener los padres.");
    } finally {
      setLoading(false);
    }
  };

  const getParent = async (id) => {
    try {
      setLoading(true);
      const res = await getParentRequest(id);
      const objectData = res.data;
      setParent(objectData);
      if(!setValue) return objectData;
      setValue("firstname", objectData.firstname);
      setValue("lastnamepaternal", objectData.lastnamepaternal);
      setValue("lastnamematernal", objectData.lastnamematernal);
      setValue("curp", objectData.curp);
      setValue("rfc", objectData.rfc);
      setValue("birthdate", formatDateShort(objectData.birthdate));
      setValue("email", objectData.email);
      setValue("phonenumber", objectData.phonenumber);
      setValue("colony", objectData.address.settlement);
      setValue("street", objectData.address.street);
      setValue("postalcode", objectData.address.postalcode);
      setValue("addressid", objectData.address.id);
      setValue("status", objectData.status);
      setValue("gender", objectData.gender);
      setValue("type", objectData.type);
      return objectData;
    } catch (error) {
      toast.error("Error al obtener los datos del padre.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialog = (object) => {
    setParentToDelete(object);
    setShowDialog((prev) => !prev);
  };

  const handleChangeInput = (e, name, type) => {
    let value = null;
    if (type === "number") value = e.target.value.replace(/[^0-9]/g, "");
    setValue(name, value ?? e.target.value);
  };

  const handleChangeSelect = (value, name) => setValue(name, value);

  return {
    deleteParent,
    errors,
    loading,
    registerParent,
    getParents,
    handleDialog,
    showDialog,
    parentToDelete,
    parent,
    getParent,
    handleChangeInput,
    handleChangeSelect,
    updateParent
  };
}
