import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGrade } from "../../../hooks/useGrade";
import InputSelect from "../../../components/InputSelect";
import AlertMessage from "../../../components/AlertMessage";

function EditGrades() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    errors: updatedErrors,
    getDataToUpdateForm,
    loading,
    handleOptionChange,
    handleChangeInput,
    validEvaluations,
    subjects,
    students,
    updateGrades,
    subjectSelected,
  } = useGrade({ setValue });

  const onSubmit = handleSubmit(async (data) => {
    const studentsAdded = students.map((student) => {
      return {
        sub_stud_id: student.id,
        grade: data["G" + student.id] ?? null,
        assist: data["A" + student.id] ?? null,
        noAssist: data["I" + student.id] ?? null,
      };
    });
    data.students = studentsAdded;
    const res = await updateGrades(data);
    if (res?.statusText === "OK") navigate("/viceprincipal/grades");
  });

  useEffect(() => {
    getDataToUpdateForm();
  }, []);

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
          {updatedErrors.map((error, i) => (
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
            Object.keys(errors).length > 0 || updatedErrors.length > 0
              ? "mt-3"
              : ""
          }`}
        >
          <header className="min-h-[50px] w-full flex gap-10 items-center">
            <section className="flex flex-wrap gap-10 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <div className="w-[200px]">
                  {!loading && (
                    <>
                      <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                        Materia
                      </label>
                      <InputSelect
                        options={subjects?.map(
                          (subject) =>
                            `${subject.name} - ${subject.grade}${subject.group}`
                        )}
                        onOptionChange={handleOptionChange}
                        style="focus:border-blue-400 focus:border focus:outline-none h-[50px]"
                        styleArrow="inset-y-[25%]"
                        object="subject_update"
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="relative flex-1 w-[205px]">
                {!loading &&
                  (validEvaluations.length > 0 ? (
                    <>
                      <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                        Número de evaluación
                        <span className="text-red-500">*</span>
                      </label>
                      <InputSelect
                        options={validEvaluations}
                        onOptionChange={handleOptionChange}
                        style="focus:border-blue-400 focus:border focus:outline-none h-[50px]"
                        styleArrow="inset-y-[25%]"
                        object="evaluation_number_update"
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
            <h1 className="flex-1 py-1 text-center border-b font-medium text-xl">{`${subjectSelected?.name} - ${subjectSelected?.grade}${subjectSelected?.group}`}</h1>
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
                {loading ? (
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
                            {...register("G" + student.id, {
                              required: `Se requiere la calificación del estudiante ${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`,
                              pattern: {
                                value: /^[0-9.]+$/,
                                message: `Solo se permiten números en la calificación del estudiante ${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`,
                              },
                            })}
                            className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                            onChange={(e) =>
                              handleChangeInput(e, "" + student.id, "number")
                            }
                            min={0}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            {...register("A" + student.id, {
                              required: `Se requiere la asistencia del estudiante ${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`,
                              pattern: {
                                value: /^[0-9.]+$/,
                                message: `Solo se permiten números en la asistencia del estudiante ${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`,
                              },
                            })}
                            className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                            onChange={(e) =>
                              handleChangeInput(e, "" + student.id, "number")
                            }
                            min={0}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            {...register("I" + student.id, {
                              required: `Se requiere la inasistencia del estudiante ${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`,
                              pattern: {
                                value: /^[0-9.]+$/,
                                message: `Solo se permiten números en la inasistencia del estudiante ${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`,
                              },
                            })}
                            className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                            onChange={(e) =>
                              handleChangeInput(e, "" + student.id, "number")
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
    </div>
  );
}

export default EditGrades;
