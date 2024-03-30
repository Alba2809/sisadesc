import { useState } from "react";
import {
  getSubjectStudentsRequest,
  getSubjectsOfTeacherRequest,
} from "../api/subject";

export function useAssist({ setValue } = {}) {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjectSelected, setSubjectSelected] = useState(null);
  const [errors, setErrors] = useState([]);

  const getSubjectsAndStudents = async () => {
    try {
      setLoading(true);
      const res = await getSubjectsOfTeacherRequest();
      const resSubjects = res.data;

      setSubjects(resSubjects);
      setSubjectSelected(resSubjects[0]);

      const resStudents = await getSubjectStudentsRequest(resSubjects[0].id);
      setStudents(resStudents.data);
    } catch (error) {
      toast.error("Error al obtener los datos.");
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
        const res = await getSubjectStudentsRequest(foundSubject?.id);
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

  return {
    loading,
    subjects,
    students,
    subjectSelected,
    getSubjectsAndStudents,
    handleOptionChange
  };
}
