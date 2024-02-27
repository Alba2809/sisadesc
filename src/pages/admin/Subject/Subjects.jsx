import { useAdmin } from "@context/AdminContext";
import { Fragment, useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { FaEye, FaChalkboardTeacher, FaRegCalendarCheck } from "react-icons/fa";
import { BsMortarboardFill } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { formatDateLong } from "@constants/functions";
import InputSelect from "@components/InputSelect";
import Dialog from "@components/Dialog";
import { useForm } from "react-hook-form";

function Subjects() {
  const { getOneSomething, getAllSomething, updateSomething } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [allObjects, setAllObjects] = useState([]);
  const [objects, setObjects] = useState([]);
  const [groupSize, setGroupsSize] = useState(5);
  const [groupIndex, setGroupIndex] = useState(0);
  const [isHoverEditTeacher, setIsHoverEditTeacher] = useState(0);
  const [isHoverEditStudents, setIsHoverEditStudents] = useState(0);
  const [isHoverStatus, setIsHoverStatus] = useState(0);
  const [isHoverView, setIsHoverView] = useState(0);
  const [isHoverRow, setIsHoverRow] = useState(0);
  const [showDialogStatus, setShowDialogStatus] = useState(false);
  const [showDialogView, setShowDialogView] = useState(false);
  const [showLoading, setShowLoading] = useState("");
  const [objectSelected, setObjectSelected] = useState(null);
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Activo");
  const {
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  useEffect(() => {
    if (loading) {
      async function getObjects() {
        try {
          const res = await getAllSomething("subject");
          if (res) {
            setAllObjects(res);
            setObjects(
              groupObjects(
                res.filter((object) =>
                  filterStatus === "Ambos"
                    ? true
                    : object.status === filterStatus
                )
              )
            );
          }
          setLoading(false);
        } catch (error) {
          setAllObjects([]);
        }
      }
      getObjects();
    }
  }, [loading]);

  useEffect(() => {
    if (loadingTable) {
      setObjects(
        groupObjects(
          allObjects.filter((object) =>
            filterStatus === "Ambos" ? true : object.status === filterStatus
          )
        )
      );
      setLoadingTable(false);
    }
  }, [loadingTable]);

  const groupObjects = (value) => {
    const organizedValue = Array.from(
      { length: Math.ceil(value.length / groupSize) },
      (_, index) => value.slice(index * groupSize, (index + 1) * groupSize)
    );

    return organizedValue;
  };

  const onOptionChange = (value, type) => {
    if (type === "showNumber") {
      setGroupsSize(Number.parseInt(value));
      setGroupIndex(0);
    }
    if (type === "status") {
      setFilterStatus(value);
    }
    setLoadingTable(true);
  };

  const handleNext = () => {
    setGroupIndex((prevIndex) => Math.min(prevIndex + 1, objects.length - 1));
  };

  const handleBack = () => {
    setGroupIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const startRecord = groupIndex * groupSize + 1;
  const endRecord = Math.min((groupIndex + 1) * groupSize, allObjects.length);
  const totalRecords = allObjects.length;

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (e.target.value === "") setLoading(true);

      const filteredObjects = allObjects.filter((user) =>
        Object.entries(user).some(
          ([key, value]) =>
            key !== "_id" &&
            key !== "createdAt" &&
            key !== "updatedAt" &&
            (typeof value === "string" || typeof value === "number") &&
            value
              .toString()
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
        )
      );

      setObjects(groupObjects(filteredObjects));
    }
  };

  const handleStatusObject = async () => {
    try {
      if (objectSelected)
        await updateSomething(objectSelected, null, "statusSubject");
      handleDialogStatus("");
      setLoading(true);
    } catch (error) {
      handleDialogStatus("");
    }
  };

  const handleDialogStatus = (object) => {
    setShowDialogView(false);
    setObjectSelected(object);
    setShowLoading("");
    setShowDialogStatus((prev) => !prev);
  };

  const handleDialogView = (object) => {
    setShowDialogStatus(false);
    setShowDialogView((prev) => !prev);
    async function getSubjectData() {
      setShowLoading("true");
      const resStudents = await getOneSomething(object.id, "subjectstudents");
      setStudents(resStudents);
      if (object.teacher_id) {
        const resTeacher = await getOneSomething(object.teacher_id, "teacher");
        setTeacher(resTeacher);
      }
      setShowLoading("false");
    }
    if (object) getSubjectData();
  };

  const handleStatus = (accept) => {
    if (!accept) return handleDialogStatus(null);
    setShowLoading("true");
    handleStatusObject();
  };

  const handleCloseView = (close) => {
    handleDialogView(null);
  };

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
                onOptionChange={onOptionChange}
                defaultValue="5"
                object="showNumber"
              />
            </div>
            <p>registros</p>
          </section>
          <section className="flex flex-row gap-5 items-center">
            <p>Filtar por estado</p>
            <div className="w-[150px]">
              <InputSelect
                options={["Activo", "Finalizado", "Ambos"]}
                onOptionChange={onOptionChange}
                object="status"
                defaultValue="Activo"
              />
            </div>
            <p>registros</p>
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
              {loading || loadingTable ? (
                <tr className="border-t text-gray-500">
                  <td className="p-2">Loading...</td>
                </tr>
              ) : allObjects.length < 1 ? (
                <tr className="border-t text-gray-500">
                  <td colSpan="17" className="p-2">
                    No hay materias registrados.
                  </td>
                </tr>
              ) : objects.length < 1 ? (
                <>
                  <tr className="border-t text-gray-500">
                    <td colSpan="17" className="p-2">
                      No se encontraron materias.
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {objects
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
                            <td className="p-2">{object.curp}</td>
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
                                    className={`absolute z-20 text-white text-sm rounded-md bg-[#b2b2b2] text-center w-[120px] px-5 py-0 top-[-5px] right-[110%] ${
                                      isHoverEditTeacher === object.id
                                        ? "visible"
                                        : "hidden"
                                    }`}
                                  >
                                    Asignar docente
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
                groupIndex === objects.length - 1 || allObjects.length < 1
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
            handleAction={handleStatus}
            showLoading={showLoading}
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
                <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
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
