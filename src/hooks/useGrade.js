import toast from "react-hot-toast";
import {
  getGradesSubjectRequest,
  registerGradesRequest,
  updateGradesRequest,
} from "../api/grade";
import { useState } from "react";
import { useSubject } from "./useSubject";
import { evaluationNumbers } from "../constants/constants";

export function useGrade({ setValue } = {}) {
  const [errors, setErrors] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectSelected, setSubjectSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validEvaluations, setValidEvaluations] = useState([]);
  const { getSubjects } = useSubject();

  const registerGrades = async (data) => {
    try {
      const res = await toast.promise(registerGradesRequest(data), {
        loading: "Registrando calificaciones...",
        success: "¡Calificaciones registradas!",
        error: "¡Error al registrar calificaciones!",
      });
      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
        array.map((error) => toast.error(error));
      } else {
        setErrors(error.response.data);
        error.response.data.map((error) => toast.error(error));
      }
    }
  };

  const updateGrades = async (data) => {
    try {
      const res = await toast.promise(updateGradesRequest(data), {
        loading: "Actualizando calificaciones...",
        success: "¡Calificaciones actualizadas!",
        error: "¡Error al actualizar calificaciones!",
      });
      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        array.map((error) => toast.error(error));
      } else {
        error.response.data.map((error) => toast.error(error));
      }
    }
  }

  const getSubjectsAndGrades = async () => {
    try {
      setLoading(true);
      const resSubjects = await getSubjects();
      setSubjects(resSubjects);
      setSubjectSelected(resSubjects[0]);
      const resGrades = await getGradesSubjectRequest(resSubjects[0]?.id);
      if (resGrades) setStudents(resGrades.data);
    } catch (error) {
      toast.error("¡Error al obtener las calificaciones!");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = async (value, type = "subject") => {
    try {
      setLoading(true);
      if (type === "evaluation_number") {
        setValue("evaluation_number", +value);
      } else if (type === "evaluation_number_update") {
        setValue("evaluation_number", +value);
        students.map((student) =>
          student.grades.map((grade) => {
            if (grade.evaluation_number === +value) {
              setValue(`G${student.id}`, grade.grade);
              setValue(`A${student.id}`, grade.assist_total);
              setValue(`I${student.id}`, grade.noAssist_total);
            }
          })
        );
      } else if (type.includes("subject")) {
        const foundSubject = subjects.find(
          (subject) =>
            `${subject.name} - ${subject.grade}${subject.group}` === value
        );
        setSubjectSelected(foundSubject);
        const res = await getGradesSubjectRequest(foundSubject?.id);
        const resGrades = res.data;
        setStudents(resGrades);

        if (setValue) {
          const evaluationsEvaluated = resGrades[0].grades.map((value) =>
            value.evaluation_number.toString()
          );
          if (type === "subject_update") {
            const existEvaluations = evaluationNumbers.filter((num) =>
              evaluationsEvaluated.includes(num)
            );
            setValidEvaluations(existEvaluations);
            if (existEvaluations.length > 0) {
              setValue("evaluation_number", existEvaluations[0]);
              resGrades.map((student) =>
                student.grades.map((grade) => {
                  if (grade.evaluation_number === +existEvaluations[0]) {
                    setValue(`G${student.id}`, grade.grade);
                    setValue(`A${student.id}`, grade.assist_total);
                    setValue(`I${student.id}`, grade.noAssist_total);
                  }
                })
              );
            }
          } else {
            const difference = evaluationNumbers.filter(
              (num) => !evaluationsEvaluated.includes(num)
            );
            setValidEvaluations(difference);
            if (difference.length > 0)
              setValue("evaluation_number", difference[0]);
          }
          setValue("grades", []);
        }
      }
    } catch (error) {
      toast.error("¡Error al obtener las calificaciones!");
    } finally {
      setLoading(false);
    }
  };

  const getDataToRegisterForm = async () => {
    try {
      setLoading(true);
      const resSubjects = await getSubjects();
      setSubjects(resSubjects);
      const res = await getGradesSubjectRequest(resSubjects[0]?.id);
      const resGrades = res.data;
      setSubjectSelected(resSubjects[0]);
      setStudents(resGrades);

      const evaluationsEvaluated = resGrades[0]?.grades.map((value) =>
        value.evaluation_number.toString()
      );
      const difference = evaluationNumbers.filter(
        (num) => !evaluationsEvaluated.includes(num)
      );
      setValidEvaluations(difference);
      setValue("grades", []);
      if (difference.length > 0) setValue("evaluation_number", difference[0]);
    } catch (error) {
      toast.error("¡Error al obtener las calificaciones!");
    } finally {
      setLoading(false);
    }
  };

  const getDataToUpdateForm = async () => {
    try {
      setLoading(true);
      const resSubjects = await getSubjects();
      setSubjects(resSubjects);
      const res = await getGradesSubjectRequest(resSubjects[0]?.id);
      const resGrades = res.data;
      setStudents(resGrades);
      setSubjectSelected(resSubjects[0]);
      const evaluationsEvaluated = resGrades[0]?.grades.map((value) =>
        value.evaluation_number.toString()
      );
      const existEvaluations = evaluationNumbers.filter((num) =>
        evaluationsEvaluated.includes(num)
      );
      setValidEvaluations(existEvaluations);
      setValue("grades", []);

      if (existEvaluations.length > 0) {
        setValue("evaluation_number", existEvaluations[0]);

        resGrades.map((student) =>
          student.grades.map((grade) => {
            if (grade.evaluation_number === +existEvaluations[0]) {
              setValue(`G${student.id}`, grade.grade);
              setValue(`A${student.id}`, grade.assist_total);
              setValue(`I${student.id}`, grade.noAssist_total);
            }
          })
        );
      }
    } catch (error) {
      toast.error("¡Error al obtener las calificaciones!");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeInput = (e, name, type) => {
    let value = null;
    if (type === "number") value = e.target.value.replace(/[^0-9.]/g, "");
    setValue(name, value ?? e.target.value);
  };

  return {
    loading,
    getSubjectsAndGrades,
    students,
    subjectSelected,
    subjects,
    handleOptionChange,
    validEvaluations,
    getDataToRegisterForm,
    handleChangeInput,
    errors,
    registerGrades,
    getDataToUpdateForm,
    updateGrades
  };
}
