import { useTeacher } from "@context/TeacherContext";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import toast, { Toaster } from "react-hot-toast";
import InputSelect from "@components/InputSelect";
import PrintAssist from "@components/Pdf/PrintAssist";

function Assists() {
  const { getAllSomething, getOneSomething } = useTeacher();
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
          if (resSubjects.length > 0) {
            setSubjects(resSubjects);
            setSubjectSelected(resSubjects[0]);
            const resAssists = await getOneSomething(
              resSubjects[0].id,
              "student"
            );
            if (resAssists) {
              setStudents(resAssists);
            }
          }
          setLoading(false);
        } catch (error) {}
      }
      getData();
    }
  }, [loading]);

  const onOptionChange = (value) => {
    const foundSubject = subjects.find(
      (subject) => `${subject.name} - ${subject.group}` === value
    );
    setSubjectSelected(foundSubject);
    setLoadingChanges(true);
  };

  useEffect(() => {
    if (loadingChanges) {
      async function getData() {
        try {
          const resAssists = await getOneSomething(
            subjectSelected.id,
            "student"
          );
          if (resAssists) {
            setStudents(resAssists);
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
          Lista de asistencias
        </h1>
      </header>
      <section className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto">
        <header className="h-[50px] w-full flex gap-10 items-center">
          <section className="flex flex-row gap-5 items-center">
            <p>Materia</p>
            <div className="w-[200px]">
              {loading ? (
                "Loading..."
              ) : subjects.length > 0 ? (
                <InputSelect
                  options={subjects.map(
                    (subject) => `${subject.name} - ${subject.group}`
                  )}
                  onOptionChange={onOptionChange}
                />
              ) : (
                <p>No se encontraron materias activas.</p>
              )}
            </div>
          </section>
          {subjectSelected && (
            <button className="py-2 px-8 bg-blue-600 hover:bg-[#18aefa] text-white text-lg rounded-lg" onClick={handlePrint}>
              Descargar lista
            </button>
          )}
        </header>
        <div className="flex-1 w-full overflow-x-auto mt-5 border border-gray-300">
          <table className="table-auto w-full min-w-[800px] relative">
            <thead className="h-[50px] bg-[#f8f9fb] font-serif font-semibold">
              <tr>
                <th className="text-start px-2 min-w-[250px]">Estudiante</th>
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
          <PrintAssist
            students={students}
            subject={subjectSelected}
            ref={printRef}
          />
        )}
      </div>
    </div>
  );
}

export default Assists;
