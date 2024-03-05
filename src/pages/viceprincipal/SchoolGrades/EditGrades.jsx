import { useViceprincipal } from "@context/ViceprincipalContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InputSelect from "@components/InputSelect";
import AlertMessage from "@components/AlertMessage";
import Dialog from "@components/Dialog";

function EditGrades() {
  const {
    getAllSomething,
    getOneSomething,
    updateSomething,
    errors: registerErrors,
  } = useViceprincipal();
  const [showDialog, setShowDialog] = useState(false);
  const [showLoading, setShowLoading] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingChanges, setLoadingChanges] = useState(false);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectSelected, setSubjectSelected] = useState(null);
  const [validEvaluations, setValidEvaluations] = useState([]);
  const navigate = useNavigate();
  const evaluationNumbers = ["1", "2", "3"];
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
          grade: data["G" + student.subject_student_id] ?? null,
          assist: data["A" + student.subject_student_id] ?? null,
          noAssist: data["I" + student.subject_student_id] ?? null,
        };
      });
      data.students = studentsAdded;
      const res = await updateSomething(data, "grades", null);
      handleDialog();
      if (res?.statusText === "OK") {
        toast.success("Registro exitoso");
        navigate("/viceprincipal/grades");
      }
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
          if (resSubjects.length > 0) {
            setSubjects(resSubjects);
            const resGrades = await getOneSomething(
              resSubjects[0].id,
              "grades"
            );
            setStudents(resGrades);
            const evaluationsEvaluated = resGrades[0].grades.map((value) =>
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
                    setValue(`G${student.subject_student_id}`, grade.grade);
                    setValue(`A${student.subject_student_id}`, grade.assist_total);
                    setValue(`I${student.subject_student_id}`, grade.noAssist_total);
                  }
                })
              );
            }
          }
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setSubjects([]);
          setStudents([]);
        }
      }
      getData();
    }
  }, [loading]);

  useEffect(() => {
    if (loadingChanges) {
      async function getData() {
        try {
          const resGrades = await getOneSomething(subjectSelected.id, "grades");
          if (resGrades.length > 0) {
            setStudents(resGrades);
            const evaluationsEvaluated = resGrades[0].grades.map((value) =>
              value.evaluation_number.toString()
            );
            const existEvaluations = evaluationNumbers.filter((num) =>
              evaluationsEvaluated.includes(num)
            );
            setValidEvaluations(existEvaluations);
            if (existEvaluations.length > 0) {
              setValue("evaluation_number", existEvaluations[0]);
              /* setValue of all students grades into form */
              /* explanation: 
              - The student grades are stored in the grade array of each student.
              - The grades are stored in the form as G{id} and A{id}.
              
               */
              resGrades.map((student) =>
                student.grades.map((grade) => {
                  if (grade.evaluation_number === +existEvaluations[0]) {
                    setValue(`G${student.subject_student_id}`, grade.grade);
                    setValue(`A${student.subject_student_id}`, grade.assist_total);
                    setValue(`I${student.subject_student_id}`, grade.noAssist_total);
                  }
                })
              );
            }
          } else {
            setStudents([]);
            setValidEvaluations([]);
          }
          setLoadingChanges(false);
          setValue("grades", []);
        } catch (error) {
          setStudents([]);
          setValidEvaluations([]);
          setStudents([]);
          setLoadingChanges(false);
        }
      }
      getData();
    }
  }, [loadingChanges]);

  const onOptionChange = (value, type) => {
    if (type === "evaluation_number") {
      setValue("evaluation_number", +value);
      students.map((student) =>
        student.grades.map((grade) => {
          if (grade.evaluation_number === +value) {
            setValue(`G${student.subject_student_id}`, grade.grade);
            setValue(`A${student.subject_student_id}`, grade.assist_total);
            setValue(`I${student.subject_student_id}`, grade.noAssist_total);
          }
        })
      );
    } else if (type === "subject") {
      const foundSubject = subjects.find(
        (subject) =>
          `${subject.name} - ${subject.grade}${subject.group}` === value
      );
      setSubjectSelected(foundSubject);
      setLoadingChanges(true);
    }
  };

  const handleChangeInput = (e, name, type) => {
    let value = null;
    if (type === "number") value = e.target.value.replace(/[^0-9.]/g, "");
    setValue(name, value ?? e.target.value);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">
          Registrar calificación
        </h1>
      </header>
      <section
        className="flex-1 flex flex-col p-10 bg-white rounded-lg overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#a5a5a5 transparent",
        }}
      >
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
        <form
          onSubmit={onSubmit}
          className={`flex-1 flex flex-col ${
            Object.keys(errors).length > 0 || registerErrors.length > 0
              ? "mt-3"
              : ""
          }`}
        >
          <header className="min-h-[50px] w-full flex gap-10 items-center">
            <section className="flex flex-wrap gap-10 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <div className="w-[200px]">
                  {loading ? (
                    "Loading..."
                  ) : (
                    <>
                      <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                        Materia
                      </label>
                      <InputSelect
                        options={subjects.map(
                          (subject) =>
                            `${subject.name} - ${subject.grade}${subject.group}`
                        )}
                        onOptionChange={onOptionChange}
                        style="focus:border-blue-400 focus:border focus:outline-none h-[50px]"
                        styleArrow="inset-y-[25%]"
                        object="subject"
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="relative flex-1 w-[205px]">
                {!loading &&
                  !loadingChanges &&
                  (validEvaluations.length > 0 ? (
                    <>
                      <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                        Número de evaluación
                        <span className="text-red-500">*</span>
                      </label>
                      <InputSelect
                        options={validEvaluations}
                        onOptionChange={onOptionChange}
                        style="focus:border-blue-400 focus:border focus:outline-none h-[50px]"
                        styleArrow="inset-y-[25%]"
                        object="evaluation_number"
                      />
                    </>
                  ) : students.length <= 0 ? (
                    <p>No se puede registrar calificaciones sin alumnos.</p>
                  ) : (
                    <p>Ya se han registrados las tres evaluaciones.</p>
                  ))}
              </div>
              {students.length > 0 ? (
                validEvaluations.length <= 0 ? null : (
                  <button
                    type="submit"
                    className="py-2 px-8 bg-blue-600 hover:bg-[#18aefa] text-white text-lg rounded-lg"
                  >
                    Actualizar
                  </button>
                )
              ) : null}
            </section>
          </header>
          <div
            className="flex-1 max-h-full w-full overflow-y-auto max-w-[800px] overflow-x-auto mt-5 border border-gray-300"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#a5a5a5 transparent",
            }}
          >
            <table className="table-auto w-full relative">
              <thead className="h-[50px] bg-[#f8f9fb] font-serif font-semibold">
                <tr>
                  <th className="text-start px-2 min-w-[250px]">Estudiante</th>
                  <th className="text-center px-2 min-w-[100px]">
                    Calificación
                  </th>
                  <th className="text-center px-2 min-w-[150px]">
                    Asistencia total
                  </th>
                  <th className="text-center px-2 min-w-[150px]">
                    Inasistencia total
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
                      >
                        <td className="p-2">{`${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`}</td>
                        <td className="p-2">
                          <input
                            type="text"
                            {...register("G" + student.subject_student_id, {
                              required: `Se requiere la calificación del estudiante ${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`,
                              pattern: {
                                value: /^[0-9.]+$/,
                                message: `Solo se permiten números en la calificación del estudiante ${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`,
                              },
                            })}
                            className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                            onChange={(e) =>
                              handleChangeInput(
                                e,
                                "" + student.subject_student_id,
                                "number"
                              )
                            }
                            min={0}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            {...register("A" + student.subject_student_id, {
                              required: `Se requiere la asistencia del estudiante ${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`,
                              pattern: {
                                value: /^[0-9.]+$/,
                                message: `Solo se permiten números en la asistencia del estudiante ${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`,
                              },
                            })}
                            className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                            onChange={(e) =>
                              handleChangeInput(
                                e,
                                "" + student.subject_student_id,
                                "number"
                              )
                            }
                            min={0}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            {...register("I" + student.subject_student_id, {
                              required: `Se requiere la inasistencia del estudiante ${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`,
                              pattern: {
                                value: /^[0-9.]+$/,
                                message: `Solo se permiten números en la inasistencia del estudiante ${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`,
                              },
                            })}
                            className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                            onChange={(e) =>
                              handleChangeInput(
                                e,
                                "" + student.subject_student_id,
                                "number"
                              )
                            }
                            min={0}
                          />
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

export default EditGrades;
