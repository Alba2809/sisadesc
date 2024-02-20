import { useTeacher } from "@context/TeacherContext";
import { useEffect, useState } from "react";
import InputSelect from "@components/InputSelect";

function Grades() {
  const { getAllSomething, getOneSomething } = useTeacher();
  const [loading, setLoading] = useState(true);
  const [loadingChanges, setLoadingChanges] = useState(false);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectSelected, setSubjectSelected] = useState(null);

  useEffect(() => {
    if (loading) {
      async function getData() {
        try {
          const resSubjects = await getAllSomething("subject");
          if (resSubjects) {
            setSubjects(resSubjects);
            const resGrades = await getOneSomething(
              resSubjects[0].id,
              "grades"
            );
            if (resGrades) {
              setStudents(resGrades);
            }
          }
          setLoading(false);
        } catch (error) {}
      }
      getData();
    }
  }, [loading]);

  const onOptionChange = (value, type) => {
    if (type === "subject") {
      const foundSubject = subjects.find(
        (subject) => `${subject.name} - ${subject.group}` === value
      );
      setSubjectSelected(foundSubject);
      setLoadingChanges(true);
    } else if (type === "dates") {
      if (rangesDates[value] === null) {
        setStartDate(null);
        setEndDate(null);
      } else {
        setStartDate(rangesDates[value].start);
        setEndDate(rangesDates[value].end);
      }
    }
  };

  useEffect(() => {
    if (loadingChanges) {
      async function getData() {
        try {
          const resGrades = await getOneSomething(
            subjectSelected.id,
            "grades"
          );
          if (resGrades) {
            setStudents(resGrades);
          }
          setLoadingChanges(false);
        } catch (error) {}
      }
      getData();
    }
  }, [loadingChanges]);

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">
          Lista de calificaciones
        </h1>
      </header>
      <section className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto">
        <header className="h-[50px] w-full flex gap-10 items-center">
          <section className="flex flex-row gap-5 items-center">
            <p>Materia</p>
            <div className="w-[200px]">
              {loading ? (
                "Loading..."
              ) : (
                <InputSelect
                  options={subjects.map(
                    (subject) => `${subject.name} - ${subject.group}`
                  )}
                  onOptionChange={onOptionChange}
                  object="subject"
                />
              )}
            </div>
          </section>
        </header>
        <div className="flex-1 w-full overflow-x-auto mt-5 border border-gray-300">
          <table className="table-auto w-full min-w-[800px] relative">
            <thead className="h-[50px] bg-[#f8f9fb] font-serif font-semibold">
              <tr>
                <th className="text-start px-2 min-w-[250px]">Estudiante</th>
                {loading ? (
                  <th>Loading...</th>
                ) : (
                  students[0]?.grades?.map((grade, index) => (
                      <th
                        className="text-center px-2 min-w-[150px]"
                        key={index + grade.evaluation_number}
                      >
                        Evaluación {grade.evaluation_number}
                      </th>
                    ))
                )}
              </tr>
            </thead>
            <tbody>
              {loading || loadingChanges ? (
                <tr className="border-t text-gray-500">
                  <td className="p-2">Loading...</td>
                </tr>
              ) : students.length < 1 ? (
                <>
                  <tr className="border-t text-gray-500">
                    <td colSpan="17" className="p-2">
                      No se encontraron estudiantes.
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {students.map((student, index) => (
                    <tr
                      key={index}
                      className="border-y-[1px] border-gray-300 h-[60px] hover:bg-[#f7f7f7]"
                    >
                      <td className="p-2">{`${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`}</td>
                      {student.grades?.map((grade, i) => (
                          <td className="p-2 text-center" key={i}>
                            {grade.grade}
                          </td>
                        ))}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Grades