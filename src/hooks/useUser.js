import { useEffect, useState } from "react";
import {
  deleteUserRequest,
  getUserRequest,
  getUsersRequest,
  registerUserRequest,
  updateUserRequest,
} from "../api/user";
import { formatDateShort, groupArray } from "../constants/functions";
import toast from "react-hot-toast";

export function useUser() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [groupSize, setGroupsSize] = useState(5);
  const [groupIndex, setGroupIndex] = useState(0);
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
      const userData = res.data
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
      setAllUsers(res.data);
      setUsers(groupArray(res.data, groupSize));
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

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (e.target.value === "") return getUsers(5);

      const filteredUsers = allUsers.filter((user) =>
        Object.entries(user).some(
          ([key, value]) =>
            key !== "id" &&
            key !== "imageperfile" &&
            key !== "createdAt" &&
            key !== "updatedAt" &&
            key !== "role" &&
            key !== "address" &&
            (typeof value === "string" || typeof value === "number") &&
            value
              .toString()
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
        )
      );

      setUsers(groupArray(filteredUsers, groupSize));
    }
  };

  const groupUsers = (groupSize) => {
    return setUsers(groupArray(allUsers, groupSize));
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
    allUsers,
    users,
    user,
    groupSize,
    groupIndex,
    userToDelete,
    setUser,
    setUserToDelete,
    setGroupsSize,
    setGroupIndex,
    registerUser,
    updateUser,
    getUser,
    getUsers,
    deleteUser,
    handleSearch,
    groupUsers,
    handleShowDialog,
    showDialog,
    handleActionDialog,
  };
}
