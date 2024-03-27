import { useAdmin } from "@context/AdminContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa";
import Dialog from "@components/Dialog";
import AlertMessage from "@components/AlertMessage";
import InputSelect from "@components/InputSelect";
import { useSubject } from "../../../hooks/useSubject";
import { useGroupTable } from "../../../hooks/useGroupTable";
import { useStudent } from "../../../hooks/useStudent";

function EditSubject({ type }) {
  const params = useParams();
  const [studentsAdded, setStudentsAdded] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const navigate = useNavigate();
  const { getSubject, updateSubject, loading, subjectSelected: subject, errors: updateErrors } = useSubject();
  const {
    allObjects,
    setDataWithoutFilter,
    objects,
    groupIndex,
    handleOptionGroup,
    handleNext,
    handleBack,
    startRecord,
    endRecord,
    totalRecords,
    handleSearch,
    setFilterStatus
  } = useGroupTable();
  const { getStudents, loading: loadingStudents } = useStudent();

  useEffect(() => {
    async function getSubjectData() {
      const objectData = await getSubject(params.id);
      const resStudents = await getStudents();
      setDataWithoutFilter(resStudents);
      setFilterStatus("Ambos")
      setValue("name", objectData.name);
      setValue("code", objectData.code);
      setValue("group", objectData.group);
      setValue("teacher", objectData.teacher_curp);
      setValue("counselor", objectData.counselor_curp);
      setValue(
        "students",
        objectData.students?.map((student) => student.student_id)
      );
      setStudentsAdded(
        objectData.students?.map((student) => student.student_id)
      );
    }
    getSubjectData();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.students.length === 0) data.students = null;
      const res = await updateSubject(subject.id, data);
      if (res?.statusText === "OK") navigate("/admin/subjects");
    } catch (error) {
      console.log(error);
    }
  });

  const handleAddStudent = (student) => {
    const studentsArray = [...getValues("students")];
    if (studentsArray.includes(student)) {
      const updatedStudents = studentsArray.filter(
        (existingStudent) => existingStudent !== student
      );
      setValue("students", updatedStudents);
    } else {
      setValue("students", [...studentsArray, student]);
    }
    setStudentsAdded(getValues("students"));
  };

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Editar materia</h1>
      </header>
      <section className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <AnimatePresence mode="sync">
              {updateErrors.map((error, i) => (
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
              className="flex flex-wrap justify-stretch gap-5 gap-y-8 mt-5"
            >
              <h2 className="w-full font-medium font-serif text-xl">
                Información de la materia
              </h2>
              <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  ID<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full text-black px-4 py-3 rounded-md border border-gray-300 bg-[#e8ecef]"
                  defaultValue={"ASIG" + subject.id}
                  disabled
                />
              </div>
              <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Nombre de la materia<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={20}
                  {...register("name", {
                    required: "Se requiere el nombre",
                    maxLength: {
                      value: 20,
                      message: "El nombre no debe exceder los 20 caracteres",
                    },
                  })}
                  className="w-full text-black px-4 py-3 rounded-md border border-gray-300 bg-[#e8ecef]"
                  disabled
                />
              </div>
              <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Código<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  {...register("code", {
                    required: "Se requiere el código",
                    maxLength: {
                      value: 10,
                      message: "El código no debe exceder los 10 caracteres",
                    },
                  })}
                  className="w-full text-black px-4 py-3 rounded-md border border-gray-300 bg-[#e8ecef]"
                  disabled
                />
              </div>
              {type === "teacher" && (
                <>
                  <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                    <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                      CURP del docente
                    </label>
                    <input
                      type="text"
                      maxLength={18}
                      {...register("teacher", {
                        required: false,
                        maxLength: {
                          value: 18,
                          message:
                            "La CURP del maestro no debe exceder los 18 caracteres",
                        },
                        pattern: {
                          value: /^[A-ZÑ]{4}[0-9]{6}[A-ZÑ]{6,7}[0-9]{1,2}$/,
                          message:
                            "CURP del maestro inválido. Verifique el formato y que las letras sean mayúsculas.",
                        },
                      })}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    />
                  </div>
                  <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                    <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                      CURP del asesor
                    </label>
                    <input
                      type="text"
                      maxLength={18}
                      {...register("counselor", {
                        required: false,
                        maxLength: {
                          value: 18,
                          message:
                            "La CURP del asesor no debe exceder los 18 caracteres",
                        },
                        pattern: {
                          value: /^[A-ZÑ]{4}[0-9]{6}[A-ZÑ]{6,7}[0-9]{1,2}$/,
                          message:
                            "CURP del asesor inválido. Verifique el formato y que las letras sean mayúsculas.",
                        },
                      })}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    />
                  </div>
                </>
              )}
              {type === "student" && (
                <input
                  type="text"
                  {...register("students", { required: false })}
                  className="hidden"
                  hidden
                />
              )}
              <section className="w-full">
                <button
                  type="submit"
                  className="py-2 px-8 bg-blue-600 hover:bg-[#18aefa] text-white text-lg rounded-lg"
                >
                  Actualizar
                </button>
              </section>
            </form>
            {type === "student" && (
              <section className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto">
                <header className="h-[50px] w-full flex items-center justify-between">
                  <section className="flex flex-row gap-5 items-center">
                    <p>Mostrar</p>
                    <div className="w-[70px]">
                      <InputSelect
                        options={[
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                          "10",
                        ]}
                        onOptionChange={handleOptionGroup}
                        defaultValue="5"
                      />
                    </div>
                    <p>registros</p>
                  </section>
                  <section className="flex items-center gap-5">
                    <label>Buscar estudiante:</label>
                    <input
                      type="text"
                      className="w-[200px] py-1 px-3 border border-gray-300 text-gray-500 focus:border-blue-500 focus:border-2 focus:outline-none rounded-md"
                      placeholder="Ingrese un texto"
                      onKeyDown={handleSearch}
                    />
                  </section>
                </header>
                <div
                  className="flex-1 w-full overflow-x-auto mt-5 border border-gray-300"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#a5a5a5 transparent",
                  }}
                >
                  <table className="table-auto w-full min-w-[600px] relative">
                    <thead className="h-[50px] bg-[#f8f9fb] font-serif font-semibold">
                      <tr>
                        <th className="text-start px-2 min-w-[25px]"></th>
                        <th className="text-start px-2 min-w-[80px]">ID</th>
                        <th className="text-start px-2 min-w-[270px]">
                          Nombre
                        </th>
                        <th className="text-start px-2 min-w-[270px]">CURP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingStudents ? (
                        <tr className="border-t text-gray-500">
                          <td className="p-2">Loading...</td>
                        </tr>
                      ) : allObjects.length < 1 ? (
                        <tr className="border-t text-gray-500">
                          <td colSpan="17" className="p-2">
                            No hay estudiantes registrados.
                          </td>
                        </tr>
                      ) : objects.length < 1 ? (
                          <tr className="border-t text-gray-500">
                            <td colSpan="17" className="p-2">
                              No se encontraron estudiantes.
                            </td>
                          </tr>
                      ) : (
                        <>
                          {objects
                            .filter((group, index) => index === groupIndex)
                            .map((group, groupIndex) => (
                              <Fragment key={groupIndex}>
                                {group.map((object, objectIndex) => (
                                  <tr
                                    key={`${groupIndex}-${objectIndex}`}
                                    className="border-y-[1px] border-gray-300 h-[60px] hover:bg-[#f7f7f7] cursor-pointer"
                                    onClick={() => handleAddStudent(object.id)}
                                  >
                                    <td className="p-2">
                                      <div
                                        className={`min-w-4 min-h-4 max-h-4 max-w-4 border border-gray-600 rounded-[5px] flex items-center justify-center ${
                                          studentsAdded.includes(object.id)
                                            ? "bg-blue-600"
                                            : "bg-white"
                                        }`}
                                      >
                                        <FaCheck color="white" size="0.6em" />
                                      </div>
                                    </td>
                                    <td className="p-2">{"STD" + object.id}</td>
                                    <td className="p-2">{`${object.firstname} ${object.lastnamepaternal} ${object.lastnamematernal}`}</td>
                                    <td className="p-2">{object.curp}</td>
                                  </tr>
                                ))}
                              </Fragment>
                            ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                <footer className="flex flex-row justify-between mt-8 items-center">
                  {allObjects.length > 0 ? (
                    <p>
                      Mostrando {startRecord} a {endRecord} de {totalRecords}{" "}
                      registro(s)
                    </p>
                  ) : (
                    <p>Mostrando 0 a 0 de 0 registro(s)</p>
                  )}
                  <div>
                    <button
                      onClick={handleBack}
                      disabled={groupIndex === 0 || allObjects.length < 1}
                      className="px-3 py-2 bg-white border-y border-l border-gray-300 rounded-s-md text-gray-500 hover:bg-[#3c5fdf] hover:text-white"
                    >
                      Anterior
                    </button>
                    <label className="px-3 py-[9.5px] border-y border-gray-300 bg-[#3c5fdf] text-white">
                      {groupIndex + 1}
                    </label>
                    <button
                      onClick={handleNext}
                      disabled={
                        groupIndex === objects.length - 1 ||
                        allObjects.length < 1
                      }
                      className="px-3 py-2 bg-white border-y border-r border-gray-300 rounded-e-md text-gray-500 hover:bg-[#3c5fdf] hover:text-white"
                    >
                      Siguiente
                    </button>
                  </div>
                </footer>
              </section>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default EditSubject;
