import { useTeacher } from "@context/TeacherContext";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { formatDateShort, formatDateLong } from "@constants/functions";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import InputSelect from "@components/InputSelect";
import AlertMessage from "@components/AlertMessage";
import Dialog from "@components/Dialog";

function RegisterAssists() {
  const {
    getAllSomething,
    getOneSomething,
    registerSomething,
    errors: registerErrors,
  } = useTeacher();
  const [showDialog, setShowDialog] = useState(false);
  const [showLoading, setShowLoading] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingChanges, setLoadingChanges] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsAssisted, setStudentsAssisted] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectSelected, setSubjectSelected] = useState(null);
  const [dateSelected, setDateSelected] = useState(new Date().toString());
  const dateInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      handleDialog();
      const studentsAdded = students.map((student) => {
        return {
          sub_stud_id: student.subject_student_id,
          assist: studentsAssisted.includes(student.subject_student_id) ? 1 : null,
        };
      });
      data.students = studentsAdded;
      const res = await registerSomething(data, "assists");
      handleDialog();
      if (res?.statusText === "OK") toast.success("Registro exitoso");
    } catch (error) {
      handleDialog();
    }
  });
  
  const handleDialog = () => {
    setShowLoading((prev) => (prev === "" ? "true" : ""));
    setShowDialog((prev) => !prev);
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
            setStudents(resAssists);
            setValue("students", []);
            setValue("date", formatDateShort(new Date()));
          }
          setLoading(false);
        } catch (error) {}
      }
      getData();
    }
  }, [loading]);

  useEffect(() => {
    if (loadingChanges) {
      async function getData() {
        try {
          const resAssists = await getOneSomething(
            subjectSelected.id,
            "assists"
          );
          if (resAssists?.statusText === "OK") {
            setStudents(resAssists);
          } else setStudents([]);
          setLoadingChanges(false);
          setValue("students", []);
        } catch (error) {
          setStudents([]);
        }
      }
      getData();
    }
  }, [loadingChanges]);

  const onOptionChange = (value) => {
    const foundSubject = subjects.find(
      (subject) => `${subject.name} - ${subject.group}` === value
    );
    setSubjectSelected(foundSubject);
    setLoadingChanges(true);
  };

  const handleAddStudent = (studentID) => {
    const foundStudent = studentsAssisted.find(
      (student) => student === studentID
    );
    
    if (!foundStudent) {
      console.log("add")
      setStudentsAssisted([...studentsAssisted, studentID]);
      setValue("students", studentsAssisted);
    } else {
      console.log("remove")
      const newStudents = studentsAssisted.filter(
        (student) => student !== studentID
      );
      setStudentsAssisted(newStudents);
      setValue("students", newStudents);
    }
  };

  const handleChangeInput = (e, name) => {
    setValue(name, e.target.value);
    setDateSelected(e.target.value);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">
          Registrar asistencia
        </h1>
      </header>
      <section className="flex-1 flex flex-col p-10 bg-white rounded-lg overflow-y-auto">
        <AnimatePresence mode="sync">
          {registerErrors.map((error, i) => (
            <motion.div
              key={i}
              initial={{ height: 0, y: -10, opacity: 0 }}
              animate={{ height: 48, y: 0, opacity: 1 }}
              exit={{ height: 0, y: -10, opacity: 0 }}
              transition={{ type: "spring", delay: i * 0.2 }}
            >
              <AlertMessage key={i} message={error} />
            </motion.div>
          ))}
          {Object.keys(errors).map((fieldName, i) => (
            <motion.div
              key={fieldName}
              initial={{ height: 0, y: -10, opacity: 0 }}
              animate={{ height: 48, y: 0, opacity: 1 }}
              exit={{ height: 0, y: -10, opacity: 0 }}
              transition={{ type: "spring", delay: i * 0.2 }}
            >
              <AlertMessage
                key={fieldName}
                message={errors[fieldName].message}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <form onSubmit={onSubmit} className={`flex-1 flex flex-col ${Object.keys(errors).length > 0 || registerErrors.length > 0 ? "mt-3" : ""}`}>
          <header className="min-h-[50px] w-full flex gap-10 items-center">
            <section className="flex flex-wrap gap-10 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Materia
                </label>
                <div className="w-[200px]">
                  {loading ? (
                    "Loading..."
                  ) : (
                    <InputSelect
                      options={subjects.map(
                        (subject) => `${subject.name} - ${subject.group}`
                      )}
                      onOptionChange={() => onOptionChange("subject")}
                      style="focus:border-blue-400 focus:border focus:outline-none h-[50px]"
                      styleArrow="inset-y-[25%]"
                    />
                  )}
                </div>
              </div>
              <div className="relative flex-1 min-w-[150px]">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Fecha de asistencia<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("date", {
                    required: "Se requiere ingresar una fecha",
                  })}
                  onChange={(e) => handleChangeInput(e, "date")}
                  ref={dateInputRef}
                  className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  defaultValue={formatDateShort(new Date().toString())}
                />
              </div>
              <button
                type="submit"
                className="py-2 px-8 bg-blue-600 hover:bg-[#18aefa] text-white text-lg rounded-lg"
              >
                Guardar
              </button>
            </section>
          </header>
          <div
            className="flex-1 max-h-full w-full overflow-y-auto max-w-[600px] overflow-x-auto mt-5 border border-gray-300"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#a5a5a5 transparent",
            }}
          >
            <table className="table-auto w-full max-w-[600px] relative">
              <thead className="h-[50px] bg-[#f8f9fb] font-serif font-semibold">
                <tr>
                  <th className="text-start px-2 min-w-[150px]">Estudiante</th>
                  <th className="text-center px-2 min-w-[100px]">
                    {formatDateLong(dateSelected)}
                  </th>
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
                        onClick={() =>
                          handleAddStudent(student.subject_student_id)
                        }
                      >
                        <td className="p-2">{`${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`}</td>
                        <td className="p-2">
                          <div className="flex items-center justify-center">
                            <div
                              className={`min-w-4 min-h-4 max-h-4 max-w-4 border border-gray-600 rounded-[5px] flex items-center justify-center ${
                                studentsAssisted.includes(
                                  student.subject_student_id
                                )
                                  ? "bg-blue-600"
                                  : "bg-white"
                              }`}
                            >
                              <FaCheck color="white" size="0.6em" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </form>
      </section>
      <AnimatePresence>
        {showDialog && (
          <Dialog
            title="Realizando registro"
            textAccept="Registrando"
            message=""
            showLoading={showLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default RegisterAssists;
