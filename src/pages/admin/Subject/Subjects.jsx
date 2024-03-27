import { useAdmin } from "@context/AdminContext";
import { Fragment, useEffect, useState } from "react";
import { FaEye, FaChalkboardTeacher, FaRegCalendarCheck } from "react-icons/fa";
import { BsMortarboardFill } from "react-icons/bs";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { formatDateLong } from "../../../constants/functions";
import InputSelect from "../../../components/InputSelect";
import Dialog from "../../../components/Dialog";
import { useSubject } from "../../../hooks/useSubject";

function Subjects() {
  const {
    loading,
    allSubjects,
    subjects,
    groupSize,
    groupIndex,
    showDialogStatus,
    showDialogView,
    subjectSelected,
    students,
    teacher,
    counselor,
    filterStatus,
    getSubjects,
    groupSubjects,
    handleNext,
    handleBack,
    startRecord,
    endRecord,
    totalRecords,
    handleSearch,
    handleStatusObject,
    handleDialogStatus,
    handleDialogView,
    handleActionStatus,
    handleCloseView,
    handleOptionGroup,
    handleOptionStatus
  } = useSubject();
  const [isHoverEditStudents, setIsHoverEditStudents] = useState(0);
  const [isHoverEditTeacher, setIsHoverEditTeacher] = useState(0);
  const [isHoverView, setIsHoverView] = useState(0);
  const [isHoverStatus, setIsHoverStatus] = useState(0);
  const [isHoverRow, setIsHoverRow] = useState(0);

  useEffect(() => {
    async function getData() {
      await getSubjects();
    }
    getData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Lista de materias</h1>
      </header>
      <section className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto">
        <header className="h-[50px] w-full flex items-center justify-between">
          <section className="flex flex-row gap-5 items-center">
            <p>Mostrar</p>
            <div className="w-[70px]">
              <InputSelect
                options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
                onOptionChange={handleOptionGroup}
                defaultValue="5"
              />
            </div>
            <p>registros</p>
          </section>
          <section className="flex flex-row gap-5 items-center">
            <p>Filtar por estado</p>
            <div className="w-[150px]">
              <InputSelect
                options={["Activo", "Finalizado", "Ambos"]}
                onOptionChange={handleOptionStatus}
                defaultValue="Activo"
              />
            </div>
          </section>
          <section className="flex items-center gap-5">
            <label>Buscar:</label>
            <input
              type="text"
              className="w-[200px] py-1 px-3 border border-gray-300 text-gray-500 focus:border-blue-500 focus:border-2 focus:outline-none rounded-md"
              placeholder="Ingrese un texto"
              onKeyDown={handleSearch}
            />
          </section>
        </header>
        <div className="flex-1 w-full overflow-x-auto mt-5 border border-gray-300">
          <table className="table-auto w-full min-w-[800px] relative">
            <thead className="h-[50px] bg-[#f8f9fb] font-serif font-semibold">
              <tr>
                <th className="text-start px-2 min-w-[80px]">ID</th>
                <th className="text-start px-2 min-w-[150px]">Nombre</th>
                <th className="text-start px-2 min-w-[110px]">Código</th>
                <th className="text-center px-2 min-w-[100px]">
                  Grado y grupo
                </th>
                <th className="text-start px-2 min-w-[100px]">Estado</th>
                <th className="text-start px-2 min-w-[200px]">Docente</th>
                <th className="text-start px-2 min-w-[200px]">Asesor</th>
                <th className="text-center px-2 min-w-[150px]">
                  Estudiantes asignados
                </th>
                <th className="text-start px-2 min-w-[230px]">
                  Fecha de registro
                </th>
                <th className="text-center px-2 min-w-[100px] sticky -right-[1px] bg-[#f8f9fb] z-10">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="border-t text-gray-500">
                  <td className="p-2">Loading...</td>
                </tr>
              ) : allSubjects.length < 1 ? (
                <tr className="border-t text-gray-500">
                  <td colSpan="17" className="p-2">
                    No hay materias registrados.
                  </td>
                </tr>
              ) : subjects.length < 1 ? (
                <>
                  <tr className="border-t text-gray-500">
                    <td colSpan="17" className="p-2">
                      No se encontraron materias.
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {subjects
                    .filter((group, index) => index === groupIndex)
                    .map((group, groupIndex) => (
                      <Fragment key={groupIndex}>
                        {group.map((object, objectIndex) => (
                          <tr
                            key={`${groupIndex}-${objectIndex}`}
                            className="border-y-[1px] border-gray-300 h-[60px] hover:bg-[#f7f7f7]"
                            onMouseEnter={() => setIsHoverRow(object.id)}
                            onMouseLeave={() => setIsHoverRow(0)}
                          >
                            <td className="p-2">{"ASIG" + object.id}</td>
                            <td className="p-2">{object.name}</td>
                            <td className="p-2">{object.code}</td>
                            <td className="p-2 text-center">{`${object.grade}${object.group}`}</td>
                            <td
                              className={`p-2 ${
                                object.status === "Finalizado"
                                  ? "text-red-400"
                                  : "text-green-600"
                              }`}
                            >
                              {object.status}
                            </td>
                            <td className="p-2">{object.teacher_curp}</td>
                            <td className="p-2">
                              {object.counselor_curp ?? "Sin asesor asignado."}
                            </td>
                            <td className="p-2 text-center">
                              {object.students_total}
                            </td>
                            <td className="p-2">
                              {formatDateLong(object.createdAt)}
                            </td>
                            <td
                              className={`p-2 sticky -right-[1px] ${
                                isHoverRow === object.id
                                  ? "bg-[#f7f7f7]"
                                  : "bg-white"
                              }`}
                            >
                              <div className=" flex gap-3 items-center justify-center">
                                <Link
                                  className="bg-[#f7f7fa] hover:bg-[#3d5ee1] w-[30px] h-[30px] rounded-full flex justify-center items-center relative"
                                  onMouseEnter={() =>
                                    setIsHoverEditStudents(object.id)
                                  }
                                  onMouseLeave={() => setIsHoverEditStudents(0)}
                                  to={`/admin/subjects/edit/students/${object.id}`}
                                >
                                  <FaChalkboardTeacher
                                    color={
                                      isHoverEditStudents === object.id
                                        ? "white"
                                        : "black"
                                    }
                                  />
                                  <p
                                    className={`absolute z-20 text-white text-sm rounded-md bg-[#b2b2b2] text-center w-[120px] px-5 py-0 top-[-5px] right-[110%] ${
                                      isHoverEditStudents === object.id
                                        ? "visible"
                                        : "hidden"
                                    }`}
                                  >
                                    Asignar estudiantes
                                  </p>
                                </Link>
                                <Link
                                  className="bg-[#f7f7fa] hover:bg-[#3d5ee1] w-[30px] h-[30px] rounded-full flex justify-center items-center relative"
                                  onMouseEnter={() =>
                                    setIsHoverEditTeacher(object.id)
                                  }
                                  onMouseLeave={() => setIsHoverEditTeacher(0)}
                                  to={`/admin/subjects/edit/teacher/${object.id}`}
                                >
                                  <BsMortarboardFill
                                    color={
                                      isHoverEditTeacher === object.id
                                        ? "white"
                                        : "black"
                                    }
                                  />
                                  <p
                                    className={`absolute z-20 text-white text-sm rounded-md bg-[#b2b2b2] text-center w-[120px] px-5 py-0 top-[-15px] right-[110%] ${
                                      isHoverEditTeacher === object.id
                                        ? "visible"
                                        : "hidden"
                                    }`}
                                  >
                                    Asignar docente y asesor
                                  </p>
                                </Link>
                                <button
                                  className="bg-[#f7f7fa] hover:bg-[#3d5ee1] w-[30px] h-[30px] rounded-full flex justify-center items-center"
                                  onMouseEnter={() => setIsHoverView(object.id)}
                                  onMouseLeave={() => setIsHoverView(0)}
                                  onClick={() => handleDialogView(object)}
                                >
                                  <FaEye
                                    color={
                                      isHoverView === object.id
                                        ? "white"
                                        : "black"
                                    }
                                  />
                                </button>
                                <button
                                  className="bg-[#f7f7fa] hover:bg-[#3d5ee1] w-[30px] h-[30px] rounded-full flex justify-center items-center relative"
                                  onMouseEnter={() =>
                                    setIsHoverStatus(object.id)
                                  }
                                  onMouseLeave={() => setIsHoverStatus(0)}
                                  onClick={() => handleDialogStatus(object.id)}
                                >
                                  <FaRegCalendarCheck
                                    color={
                                      isHoverStatus === object.id
                                        ? "white"
                                        : "black"
                                    }
                                  />
                                  <p
                                    className={`absolute z-20 text-white text-sm rounded-md bg-[#b2b2b2] text-center w-[120px] px-5 py-0 top-[-5px] right-[110%] ${
                                      isHoverStatus === object.id
                                        ? "visible"
                                        : "hidden"
                                    }`}
                                  >
                                    Finalizar materia
                                  </p>
                                </button>
                              </div>
                            </td>
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
          {allSubjects.length > 0 ? (
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
              disabled={groupIndex === 0 || allSubjects.length < 1}
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
                groupIndex === subjects.length - 1 || allSubjects.length < 1
              }
              className="px-3 py-2 bg-white border-y border-r border-gray-300 rounded-e-md text-gray-500 hover:bg-[#3c5fdf] hover:text-white"
            >
              Siguiente
            </button>
          </div>
        </footer>
      </section>
      <AnimatePresence>
        {showDialogStatus && (
          <Dialog
            title="Cambiar estado"
            textAccept="Cambiar"
            message="¿Está seguro de cambiar el estado de la materia a finalizado?"
            handleAction={handleActionStatus}
            addCancel
          />
        )}
        {showDialogView && (
          <Dialog
            title="Estudiantes y docente asignados"
            contentComponent={
              <div className="flex flex-row gap-5 items-center justify-center">
                <div
                  className="max-w-[400px] max-h-[300px] overflow-y-auto overflow-x-hidden border border-gray-300"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#a5a5a5 transparent",
                  }}
                >
                  <table className="table-fixed w-full">
                    <thead className="h-[50px] bg-[#f8f9fb] font-serif font-semibold">
                      <tr>
                        <th className="text-start px-2">Nombre</th>
                        <th className="text-start px-2">CURP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr
                          key={index}
                          className="border-y-[1px] border-gray-300 h-[60px] hover:bg-[#f7f7f7]"
                        >
                          <td className="p-2">{`${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`}</td>
                          <td className="p-2">{student.curp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%] flex flex-col gap-5">
                  <div className="relative w-full">
                    <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                      Nombre del docente
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                      defaultValue={
                        teacher
                          ? `${teacher?.firstname} ${teacher?.lastnamepaternal} ${teacher?.lastnamematernal}`
                          : ""
                      }
                      readOnly
                    />
                  </div>
                  <div className="relative w-full">
                    <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                      Nombre del asesor
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                      defaultValue={
                        counselor
                          ? `${counselor?.firstname} ${counselor?.lastnamepaternal} ${counselor?.lastnamematernal}`
                          : ""
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
            }
            handleAction={handleCloseView}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Subjects;
