import { useEffect, useState } from "react";
import { getRolesRequest } from "../api/role";
import toast from "react-hot-toast";

export function useRole({ setValue } = {}) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRoles = async () => {
    try {
      setLoading(true);
      const res = await getRolesRequest();
      setRoles(res.data);
      setValue("role", res.data[0].id);
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener los roles");
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangeRole = (value) => {
    const rol = roles.find((role) => role.name === value);
    if (rol) return setValue("role", rol.id);
    setValue("role", null);
  };

  useEffect(() => {
    getRoles();
  }, []);

  return {
    roles,
    loading,
    getRoles,
    handleChangeRole
  };
}
