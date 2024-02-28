import { useSecretary } from "@context/SecretaryContext";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import InputSelect from "@components/InputSelect";
import PrintGrades from "@components/Pdf/PrintGrades";

function Grades() {
  const { getAllSomething, getOneSomething } = useSecretary();
  const [loading, setLoading] = useState(true);
  const [loadingChanges, setLoadingChanges] = useState(false);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectSelected, setSubjectSelected] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    if (loading) {
      async function getData() {
        try {
          const resSubjects = await getAllSomething("subject");
          if (resSubjects?.length > 0) {
            setSubjects(resSubjects);
            setSubjectSelected(resSubjects[0]);
            const resGrades = await getOneSomething(
              resSubjects[0].id,
              "grades"
            );
            if (resGrades) setStudents(resGrades);
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
        (subject) => `${subject.name} - ${subject.grade}${subject.group}` === value
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
          const resGrades = await getOneSomething(subjectSelected.id, "grades");
          if (resGrades) {
            setStudents(resGrades);
          }
          setLoadingChanges(false);
        } catch (error) {}
      }
      getData();
    }
  }, [loadingChanges]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onPrintError: () =>
      toast.error(
        "Hubo un error al tratar de imprimir el archivo. Inténtelo de nuevo o inténtelo más tarde."
      ),
  });

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
                    (subject) => `${subject.name} - ${subject.grade}${subject.group}`
                  )}
                  onOptionChange={onOptionChange}
                  object="subject"
                />
              )}
            </div>
          </section>
          {subjectSelected && (
            <button
              className="py-2 px-8 bg-blue-600 hover:bg-[#18aefa] text-white text-lg rounded-lg"
              onClick={handlePrint}
            >
              Descargar calificaciones
            </button>
          )}
        </header>
        <div className="flex-1 w-full overflow-x-auto mt-5 border border-gray-300">
          <table className="table-auto w-full min-w-[1200px] relative">
            <thead className="h-[50px] bg-[#f8f9fb] font-serif font-semibold">
              <tr className="divide-x">
                <th className="text-start px-2 min-w-[250px]">Estudiante</th>
                {loading ? (
                  <th>Loading...</th>
                ) : (
                  students[0]?.grades?.map((grade, index) => (
                    <th
                      className="text-center min-w-[150px]"
                      key={index + grade.evaluation_number}
                    >
                      <div className="grid grid-cols-2 grid-rows-2">
                        <p className="col-span-2 text-lg border-b-[1px]">
                          Evaluación {grade.evaluation_number}
                        </p>
                        <p className="border-r-[1px]">Calificación</p>
                        <p className="px-[1px]">Asistencia total</p>
                      </div>
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
                      className="border-y-[1px] border-gray-300 h-[60px] hover:bg-[#f7f7f7] divide-x"
                    >
                      <td className="p-2">{`${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`}</td>
                      {student.grades?.map((grade, i) => (
                        <td className="p-2 text-center" key={i}>
                          <div className="grid grid-cols-2 divide-x">
                            <p>{grade.grade}</p>
                            <p>{grade.assist_total}</p>
                          </div>
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
      <div className="hidden">
        {subjectSelected && (
          <PrintGrades
            students={students}
            subject={subjectSelected}
            ref={printRef}
          />
        )}
      </div>
    </div>
  );
}

export default Grades;