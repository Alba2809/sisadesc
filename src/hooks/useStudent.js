import { useState } from "react";
import { getStudentsRequest } from "../api/student";
import toast from "react-hot-toast";

export function useStudent() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);

  const getStudents = async () => {
    try {
      setLoading(true);

      const res = await getStudentsRequest();
      return res.data
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener los estudiantes.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    students,
    getStudents,
  };
}
