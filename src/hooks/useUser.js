import { useEffect, useState } from "react";
import {
  deleteUserRequest,
  getUserRequest,
  getUsersRequest,
  registerUserRequest,
  updateUserRequest,
} from "../api/user";
import { formatDateShort } from "../constants/functions";
import toast from "react-hot-toast";

export function useUser({ setValue } = {}) {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const registerUser = async (data) => {
    try {
      setLoading(true);
      const res = await toast.promise(registerUserRequest(data), {
        loading: "Registrando usuario...",
        success: "¡Usuario registrado!",
        error: "¡Error al registrar usuario!",
      });

      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, data) => {
    try {
      setLoading(true);
      const res = await toast.promise(updateUserRequest(id, data), {
        loading: "Actualizando usuario...",
        success: "¡Usuario actualizado!",
        error: "¡Error al actualizar!",
      });
      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (id, setValue = null) => {
    try {
      setLoading(true);
      const res = await getUserRequest(id);
      const userData = res.data;
      if (setValue) {
        setUser(userData);
        setValue("firstname", userData.firstname);
        setValue("lastnamepaternal", userData.lastnamepaternal);
        setValue("lastnamematernal", userData.lastnamematernal);
        setValue("curp", userData.curp);
        setValue("rfc", userData.rfc);
        setValue("email", userData.email);
        setValue("addressid", +userData.address.id);
        setValue("street", userData.address.street);
        setValue("colony", userData.address.settlement);
        setValue("postalcode", userData.address.postalcode);
        setValue("phonenumber", userData.phonenumber);
        setValue("birthdate", formatDateShort(userData.birthdate));
        setValue("status", userData.status);
        setValue("role", +userData.role.id);
        setValue("imageperfile", userData.imageperfile);
      }
      return res;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsersRequest();
      return res.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    try {
      setLoading(true);

      if (!userToDelete) {
        return toast.error("Seleccione un usuario para eliminar.");
      }

      const res = await toast.promise(deleteUserRequest(userToDelete), {
        loading: "Eliminando usuario...",
        success: "¡Usuario eliminado!",
        error: "¡Error al eliminar el usuario!",
      });

      if (res.status === 200) getUsers();

      setUserToDelete(null);
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDialog = (user) => {
    setUserToDelete(user);
    setShowDialog(true);
  };

  const handleActionDialog = (accept) => {
    if (!accept) {
      setUserToDelete(null);
      setShowDialog(false);
      return;
    }
    deleteUser();
    setShowDialog(false);
  };

  const handleFileChange = (file) => {
    setValue("imageperfile", file);
  };

  const handleChange = (e) => {
    const date = e.target.value;
    setValue("birthdate", date.toString());
  };

  const handleChangeStatus = (value) => {
    setValue("status", value);
  };

  const handleInputNumber = (e) => {
    const { value } = e.target;

    const regex = /^\d*$/;
    if (regex.test(value)) {
      setValue("phonenumber", value);
    } else {
      e.target.value = e.target.value.replace(/\D/g, "");
    }
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
    errors,
    loading,
    user,
    userToDelete,
    setUser,
    setUserToDelete,
    registerUser,
    updateUser,
    getUser,
    getUsers,
    deleteUser,
    handleShowDialog,
    showDialog,
    handleActionDialog,
    handleFileChange,
    handleChange,
    handleChangeStatus,
    handleInputNumber,
  };
}
