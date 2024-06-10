import { Fragment, useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { formatDateLong } from "../../../utils/functions";
import { useUser } from "../../../hooks/useUser";
import { useGroupTable } from "../../../hooks/useGroupTable";
import InputSelect from "../../../components/InputSelect";
import Dialog from "../../../components/Dialog";
import UserDefault from "../../../assets/icons/avatar_default.jpg";

function Users() {
  const {
    allObjects: allUsers,
    setDataWithoutFilter,
    objects: users,
    groupIndex,
    handleOptionGroup,
    handleNext,
    handleBack,
    startRecord,
    endRecord,
    totalRecords,
    handleSearch,
  } = useGroupTable();
  const {
    loading,
    getUsers,
    handleActionDialog,
    handleShowDialog,
    showDialog,
  } = useUser({ restartTable: setDataWithoutFilter });
  const [isHoverEdit, setIsHoverEdit] = useState(0);
  const [isHoverDelete, setIsHoverDelete] = useState(0);
  const [isHoverRow, setIsHoverRow] = useState(0);

  useEffect(() => {
    async function getData() {
      const res = await getUsers();
      setDataWithoutFilter(res);
    }
    getData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Lista de usuarios</h1>
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
                <th className="text-start px-2 min-w-[80px]">ID</th>
                <th className="text-start px-2 min-w-[100px]">Perfil</th>
                <th className="text-start px-2 min-w-[200px]">Nombre</th>
                <th className="text-start px-2 min-w-[200px]">
                  Primer apellido
                </th>
                <th className="text-start px-2 min-w-[200px]">
                  Segundo apellido
                </th>
                <th className="text-start px-2 min-w-[200px]">CURP</th>
                <th className="text-start px-2 min-w-[200px]">RFC</th>
                <th className="text-start px-2">Email</th>
                <th className="text-start px-2 min-w-[250px]">
                  Fecha de nacimiento
                </th>
                <th className="text-start px-2 min-w-[250px]">Calle</th>
                <th className="text-start px-2 min-w-[250px]">Colonia</th>
                <th className="text-start px-2 min-w-[150px]">Código postal</th>
                <th className="text-start px-2 min-w-[150px]">Teléfono</th>
                <th className="text-start px-2 min-w-[200px]">
                  Fecha de registro
                </th>
                <th className="text-start px-2 min-w-[130px]">Rol</th>
                <th className="text-start px-2 min-w-[130px]">Estatus</th>
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
              ) : allUsers.length < 1 ? (
                <tr className="border-t text-gray-500">
                  <td colSpan="17" className="p-2">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : users.length < 1 ? (
                <>
                  <tr className="border-t text-gray-500">
                    <td colSpan="17" className="p-2">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {users
                    .filter((group, index) => index === groupIndex)
                    .map((group, groupIndex) => (
                      <Fragment key={groupIndex}>
                        {group.map((user, userIndex) => (
                          <tr
                            key={`${groupIndex}-${userIndex}`}
                            className="border-y-[1px] border-gray-300 h-[60px] hover:bg-[#f7f7f7]"
                            onMouseEnter={() => setIsHoverRow(user.id)}
                            onMouseLeave={() => setIsHoverRow(0)}
                          >
                            <td className="p-2">{user.id}</td>
                            <td className="p-2">
                              <img
                                src={user.imageperfile ?? UserDefault}
                                alt={"Imagen de perfil - " + user.id}
                                className="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full"
                                loading="lazy"
                              />
                            </td>
                            <td className="p-2">{user.firstname}</td>
                            <td className="p-2">{user.lastnamepaternal}</td>
                            <td className="p-2">{user.lastnamematernal}</td>
                            <td className="p-2">{user.curp}</td>
                            <td className="p-2">{user.rfc}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">
                              <time dateTime={user.birthdate}>
                                {formatDateLong(user.birthdate)}
                              </time>
                            </td>
                            <td className="p-2">{user.address.street}</td>
                            <td className="p-2">{user.address.settlement}</td>
                            <td className="p-2">{user.address.postalcode}</td>
                            <td className="p-2">{user.phonenumber}</td>
                            <td className="p-2">
                              <time dateTime={user.createdAt}>
                                {formatDateLong(user.createdAt)}
                              </time>
                            </td>
                            <td className="p-2">{user.role.name_spanish}</td>
                            <td className="p-2">{user.status}</td>
                            <td
                              className={`p-2 sticky -right-[1px] ${
                                isHoverRow === user.id
                                  ? "bg-[#f7f7f7]"
                                  : "bg-white"
                              }`}
                            >
                              <div className=" flex gap-3 items-center justify-center">
                                <Link
                                  className="bg-[#f7f7fa] hover:bg-[#3d5ee1] w-[30px] h-[30px] rounded-full flex justify-center items-center"
                                  onMouseEnter={() => setIsHoverEdit(user.id)}
                                  onMouseLeave={() => setIsHoverEdit(0)}
                                  to={`/admin/users/edit/${user.id}`}
                                >
                                  <FiEdit2
                                    color={
                                      isHoverEdit === user.id
                                        ? "white"
                                        : "black"
                                    }
                                  />
                                </Link>
                                <button
                                  className="bg-[#f7f7fa] hover:bg-[#3d5ee1] w-[30px] h-[30px] rounded-full flex justify-center items-center"
                                  onMouseEnter={() => setIsHoverDelete(user.id)}
                                  onMouseLeave={() => setIsHoverDelete(0)}
                                  onClick={() => handleShowDialog(user.id)}
                                >
                                  <RiDeleteBin6Line
                                    color={
                                      isHoverDelete === user.id
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
          {allUsers.length > 0 ? (
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
              disabled={groupIndex === 0}
              className="px-3 py-2 bg-white border-y border-l border-gray-300 rounded-s-md text-gray-500 hover:bg-[#3c5fdf] hover:text-white"
            >
              Anterior
            </button>
            <label className="px-3 py-[9.5px] border-y border-gray-300 bg-[#3c5fdf] text-white">
              {groupIndex + 1}
            </label>
            <button
              onClick={handleNext}
              disabled={groupIndex === users?.length - 1}
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
            title="Eliminar usuario"
            textAccept="Eliminar"
            message="¿Está seguro de eliminar el usuario?"
            handleAction={handleActionDialog}
            addCancel
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Users;
