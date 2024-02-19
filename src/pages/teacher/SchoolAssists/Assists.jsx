import { useTeacher } from "@context/TeacherContext";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { formatDateShort } from "@constants/functions";
import InputSelect from "@components/InputSelect";

function Assists() {
  const { getAllSomething, getOneSomething } = useTeacher();
  const [loading, setLoading] = useState(true);
  const [loadingChanges, setLoadingChanges] = useState(false);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectSelected, setSubjectSelected] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const rangesDates = {
    Todos: null,
    "Febrero - Abril": {
      start: `${new Date().getFullYear()}-02-01`,
      end: `${new Date().getFullYear()}-04-30`,
    },
    "Mayo - Agosto": {
      start: `${new Date().getFullYear()}-05-01`,
      end: `${new Date().getFullYear()}-08-31`,
    },
    "Septiembre - Diciembre": {
      start: `${new Date().getFullYear()}-09-01`,
      end: `${new Date().getFullYear()}-12-31`,
    },
  };

  useEffect(() => {
    if (loading) {
      async function getData() {
        try {
          const resSubjects = await getAllSomething("subject");
          if (resSubjects) {
            setSubjects(resSubjects);
            const resAssists = await getOneSomething(
              resSubjects[0].id,
              "assists"
            );
            if (resAssists) {
              setStudents(resAssists);
              console.log(resAssists);
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
      console.log(rangesDates[value]);

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
          const resAssists = await getOneSomething(
            subjectSelected.id,
            "assists"
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
          <section className="flex flex-row gap-5 items-center">
            <p>Ordenar por periodo</p>
            <div className="w-[225px]">
              <InputSelect
                options={Object.keys(rangesDates)}
                onOptionChange={onOptionChange}
                object="dates"
              />
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
                  students[0]?.assists
                    ?.filter((assist) => {
                      if (startDate === null || endDate === null) return true;
                      const dateAssist = formatDateShort(assist.date);
                      return dateAssist >= startDate && dateAssist <= endDate;
                    })
                    .map((object, index) => (
                      <th
                        className="text-center px-2 min-w-[150px]"
                        key={index + object.date}
                      >
                        {formatDateShort(object.date)}
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
                      {student.assists
                        ?.filter((assist) => {
                          if (startDate === null || endDate === null)
                            return true;
                          const dateAssist = formatDateShort(assist.date);
                          return (
                            dateAssist >= startDate && dateAssist <= endDate
                          );
                        })
                        .map((assist, i) => (
                          <td className="p-2" key={i}>
                            <div
                              className={`min-w-4 min-h-4 max-h-4 max-w-4 m-auto border border-gray-600 rounded-[5px] flex items-center justify-center ${
                                assist.assist === 1 ? "bg-blue-600" : "bg-white"
                              }`}
                            >
                              <FaCheck color="white" size="0.6em" />
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
    </div>
  );
}

export default Assists;
