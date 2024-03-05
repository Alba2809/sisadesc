import { useViceprincipal } from "@context/ViceprincipalContext";
import { Fragment, useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { formatDateLong } from "@constants/functions";
import InputSelect from "@components/InputSelect";
import Dialog from "@components/Dialog";

function Teachers() {
  const { getAllSomething, deleteSomething } = useViceprincipal();
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [allObjects, setAllObjects] = useState([]);
  const [objects, setObjects] = useState([]);
  const [groupSize, setGroupsSize] = useState(5);
  const [groupIndex, setGroupIndex] = useState(0);
  const [isHoverEdit, setIsHoverEdit] = useState(0);
  const [isHoverDelete, setIsHoverDelete] = useState(0);
  const [isHoverRow, setIsHoverRow] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [showLoading, setShowLoading] = useState("");
  const [objectToDelete, setObjectToDelete] = useState("");

  useEffect(() => {
    if (loading) {
      async function getObjects() {
        try {
          const res = await getAllSomething("teacher");
          if (res) {
            setAllObjects(res);
            setObjects(groupObjects(res));
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
      setObjects(groupObjects(allObjects));
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

  const onOptionChange = (number) => {
    setGroupsSize(Number.parseInt(number));
    setGroupIndex(0);
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
            key !== "id" &&
            key !== "imageperfile" &&
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

  const handleDeleteObject = () => {
    try {
      if(objectToDelete) deleteSomething(objectToDelete, "teacher");
      handleDialog("");
      setLoading(true);
    } catch (error) {
      handleDialog("");
    }
  };

  const handleDialog = (user) => {
    setObjectToDelete(user);
    setShowLoading("");
    setShowDialog((prev) => !prev);
  };

  const handleDelete = (accept) => {
    if (!accept) return handleDialog("");
    setShowLoading("true");
    handleDeleteObject();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Lista de docentes</h1>
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
          <table className="table-auto w-full min-w-[1300px] relative">
            <thead className="h-[50px] bg-[#f8f9fb] font-serif font-semibold">
              <tr>
                <th className="text-start px-2 min-w-[160px]">ID</th>
                <th className="text-start px-2 min-w-[200px]">Nombre</th>
                <th className="text-start px-2 min-w-[200px]">
                  Primer apellido
                </th>
                <th className="text-start px-2 min-w-[200px]">
                  Segundo apellido
                </th>
                <th className="text-start px-2 min-w-[200px]">CURP</th>
                <th className="text-start px-2 min-w-[200px]">RFC</th>
                <th className="text-start px-2 min-w-[140px]">Género</th>
                <th className="text-start px-2 min-w-[150px]">Teléfono</th>
                <th className="text-start px-2 min-w-[250px]">
                  Fecha de nacimiento
                </th>
                <th className="text-start px-2 min-w-[250px]">Calle</th>
                <th className="text-start px-2 min-w-[250px]">Colonia</th>
                <th className="text-start px-2 min-w-[150px]">Código postal</th>
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
                    No hay docentes registrados.
                  </td>
                </tr>
              ) : objects.length < 1 ? (
                <>
                  <tr className="border-t text-gray-500">
                    <td colSpan="17" className="p-2">
                      No se encontraron docentes.
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
                            <td className="p-2">{"MTR"+object.id}</td>
                            <td className="p-2">{object.firstname}</td>
                            <td className="p-2">{object.lastnamepaternal}</td>
                            <td className="p-2">{object.lastnamematernal}</td>
                            <td className="p-2">{object.curp}</td>
                            <td className="p-2">{object.rfc}</td>
                            <td className="p-2">{object.gender}</td>
                            <td className="p-2">{object.phonenumber}</td>
                            <td className="p-2">
                              {object.birthdate && (
                                <time dateTime={object.birthdate}>
                                  {formatDateLong(object.birthdate)}
                                </time>
                              )}
                            </td>
                            <td className="p-2">{object.address.street}</td>
                            <td className="p-2">{object.address.settlement}</td>
                            <td className="p-2">
                              {object.address.postalcode}
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
                                  className="bg-[#f7f7fa] hover:bg-[#3d5ee1] w-[30px] h-[30px] rounded-full flex justify-center items-center"
                                  onMouseEnter={() =>
                                    setIsHoverEdit(object.id)
                                  }
                                  onMouseLeave={() => setIsHoverEdit(0)}
                                  to={`/viceprincipal/teachers/edit/${object.id}`}
                                >
                                  <FiEdit2
                                    color={
                                      isHoverEdit === object.id
                                        ? "white"
                                        : "black"
                                    }
                                  />
                                </Link>
                                <button
                                  className="bg-[#f7f7fa] hover:bg-[#3d5ee1] w-[30px] h-[30px] rounded-full flex justify-center items-center"
                                  onMouseEnter={() =>
                                    setIsHoverDelete(object.id)
                                  }
                                  onMouseLeave={() => setIsHoverDelete(0)}
                                  onClick={() => handleDialog(object.id)}
                                >
                                  <RiDeleteBin6Line
                                    color={
                                      isHoverDelete === object.id
                                        ? "white"
                                        : "black"
                                    }
                                  />
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
        {showDialog && (
          <Dialog
            title="Eliminar docente"
            textAccept="Eliminar"
            message="¿Está seguro de eliminar el docente?"
            handleAction={handleDelete}
            showLoading={showLoading}
            addCancel
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Teachers;
