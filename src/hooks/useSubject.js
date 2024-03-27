import { useState } from "react";
import {
  getSubjectStudentsRequest,
  getSubjectsRequest,
  updateStatusSubjectRequest,
} from "../api/subject";
import toast from "react-hot-toast";
import { groupArray } from "../constants/functions";
import { getTeacherRequest } from "../api/teacher";
import { getUserRequest } from "../api/user";

export function useSubject() {
  const [loading, setLoading] = useState(true);
  const [allSubjects, setAllSubjects] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [groupSize, setGroupsSize] = useState(5);
  const [groupIndex, setGroupIndex] = useState(0);
  const [showDialogStatus, setShowDialogStatus] = useState(false);
  const [showDialogView, setShowDialogView] = useState(false);
  const [subjectSelected, setSubjectSelected] = useState(null);
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [counselor, setCounselor] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Activo");

  const getSubjects = async () => {
    try {
      setLoading(true);
      const res = await getSubjectsRequest();
      if (res.data) {
        setAllSubjects(res.data);
        setSubjects(
          groupArray(
            res.data.filter((object) =>
              filterStatus === "Ambos" ? true : object.status === filterStatus
            ),
            groupSize
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener las materias");
    } finally {
      setLoading(false);
    }
  };

  const groupSubjects = (groupSize, filterStatus) => {
    return setSubjects(
      groupArray(
        allSubjects.filter((object) =>
          filterStatus === "Ambos" ? true : object.status === filterStatus
        ),
        groupSize
      )
    );
  };
  const handleOptionGroup = (value) => {
    setGroupsSize(+value);
    setGroupIndex(0);
    groupSubjects(+value, filterStatus);
  };

  const handleOptionStatus = (status) => {
    setFilterStatus(status);
    groupSubjects(groupSize, status);
  };

  const handleNext = () => {
    setGroupIndex((prevIndex) => Math.min(prevIndex + 1, subjects.length - 1));
  };

  const handleBack = () => {
    setGroupIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const startRecord = groupIndex * groupSize + 1;

  const endRecord = Math.min((groupIndex + 1) * groupSize, allSubjects.length);
  
  const totalRecords = allSubjects.length;

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (e.target.value === "") return getSubjects()

      const filteredObjects = allSubjects.filter((user) =>
        Object.entries(user).some(
          ([key, value]) =>
            key !== "id" &&
            key !== "createdAt" &&
            key !== "updatedAt" &&
            (typeof value === "string" || typeof value === "number") &&
            value
              .toString()
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
        )
      );

      setSubjects(
        groupArray(
          filteredObjects.filter((object) =>
            filterStatus === "Ambos" ? true : object.status === filterStatus
          ),
          groupSize
        )
      );
    }
  };

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

  return {
    loading,
    allSubjects,
    subjects,
    groupSize,
    groupIndex,
    showDialogStatus,
    showDialogView,
    subjectSelected,
    students,
    teacher,
    counselor,
    filterStatus,
    getSubjects,
    groupSubjects,
    handleNext,
    handleBack,
    startRecord,
    endRecord,
    totalRecords,
    handleSearch,
    handleStatusObject,
    handleDialogStatus,
    handleDialogView,
    handleActionStatus,
    handleCloseView,
    handleOptionGroup,
    handleOptionStatus,
  };
}
