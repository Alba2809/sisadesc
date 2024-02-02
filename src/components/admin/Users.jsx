import { useAdmin } from "@context/AdminContext";
import { Fragment, useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { formatDateLong } from "@constants/functions";
import InputSelect from "@components/InputSelect";
import Dialog from "../Dialog";

function Users() {
  const { getAllSomething, deleteSomething } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupSize, setGroupsSize] = useState(5);
  const [groupIndex, setGroupIndex] = useState(0);
  const [isHoverEdit, setIsHoverEdit] = useState(0);
  const [isHoverDelete, setIsHoverDelete] = useState(0);
  const [isHoverRow, setIsHoverRow] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [showLoading, setShowLoading] = useState("");
  const [userToDelete, setUserToDelete] = useState("");

  useEffect(() => {
    if (loading) {
      async function getUsers() {
        try {
          const res = await getAllSomething("user");
          if (res) {
            const resWithId = res.map((usuario, index) => ({
              ...usuario,
              id_table: index + 1 < 10 ? `0${index + 1}` : `${index + 1}`,
            }));
            setAllUsers(resWithId);
            setUsers(groupUsers(resWithId));
          }
          setLoading(false);
        } catch (error) {
          console.log(error);
          setAllUsers([]);
        }
      }
      getUsers();
    }
  }, [loading]);

  useEffect(() => {
    if (loadingTable) {
      setUsers(groupUsers(allUsers));
      setLoadingTable(false);
    }
  }, [loadingTable]);

  const groupUsers = (value) => {
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
    setGroupIndex((prevIndex) => Math.min(prevIndex + 1, users.length - 1));
  };

  const handleBack = () => {
    setGroupIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const startRecord = groupIndex * groupSize + 1;
  const endRecord = Math.min((groupIndex + 1) * groupSize, allUsers.length);
  const totalRecords = allUsers.length;

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (e.target.value === "") setLoading(true);

      const filteredUsers = allUsers.filter((user) =>
        Object.entries(user).some(
          ([key, value]) =>
            key !== "_id" &&
            key !== "password" &&
            key !== "imageperfile" &&
            key !== "createdAt" &&
            key !== "updatedAt" &&
            key !== "role" &&
            (typeof value === "string" || typeof value === "number") &&
            value
              .toString()
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
        )
      );

      setUsers(groupUsers(filteredUsers));
    }
  };

  const handleDeleteUser = () => {
    try {
      const res = deleteSomething(userToDelete, "user");
      handleDialog("");
      setLoading(true);
    } catch (error) {
      handleDialog("");
      console.log(error);
    }
  };

  const handleDialog = (user) => {
    setUserToDelete(user);
    setShowLoading("");
    setShowDialog((prev) => !prev);
  };

  const handleDelete = (accept) => {
    if (!accept) return handleDialog("");
    setShowLoading("true");
    handleDeleteUser();
  };

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
              {loading || loadingTable ? (
                <tr className="border border-gray-300">
                  <td className="p-2">Loading...</td>
                </tr>
              ) : allUsers.length < 1 ? (
                <tr className="border border-gray-300">
                  <td className="p-2">No hay usuarios registrados.</td>
                </tr>
              ) : users.length < 1 ? (
                <>
                  <tr className="border border-gray-300">
                    <td className="p-2">No se encontraron usuarios.</td>
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
                            onMouseEnter={() => setIsHoverRow(user.id_table)}
                            onMouseLeave={() => setIsHoverRow(0)}
                          >
                            <td className="p-2">{user.id_table}</td>
                            <td className="p-2">
                              {user.imageperfile ? (
                                <img
                                  src={user.imageperfile}
                                  alt={"Imagen de perfil - " + user._id}
                                  className="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full"
                                />
                              ) : (
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/sisadesc-ca669.appspot.com/o/avatar%2Favatar_default.jpg?alt=media&token=e4d14e18-f4ae-4777-b35d-d64f0084c0e6"
                                  alt={"Imagen de perfil default"}
                                  className="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full"
                                />
                              )}
                            </td>
                            <td className="p-2">{user.firstname}</td>
                            <td className="p-2">{user.lastnamepaternal}</td>
                            <td className="p-2">{user.lastnamematernal}</td>
                            <td className="p-2">{user.curp}</td>
                            <td className="p-2">{user.rfc}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">
                              {user.birthdate && (
                                <time dateTime={userIndex.birthdate}>
                                  {formatDateLong(user.birthdate)}
                                </time>
                              )}
                            </td>
                            <td className="p-2">{user.direction.street}</td>
                            <td className="p-2">{user.direction.colony}</td>
                            <td className="p-2">{user.direction.postalcode}</td>
                            <td className="p-2">{user.phonenumber}</td>
                            <td className="p-2">
                              <time dateTime={userIndex.createdAt}>
                                {formatDateLong(user.createdAt)}
                              </time>
                            </td>
                            <td className="p-2">{user.role.name}</td>
                            <td className="p-2">{user.status}</td>
                            <td
                              className={`p-2 sticky -right-[1px] ${
                                isHoverRow === user.id_table
                                  ? "bg-[#f7f7f7]"
                                  : "bg-white"
                              }`}
                            >
                              <div className=" flex gap-3 items-center justify-center">
                                <Link
                                  className="bg-[#f7f7fa] hover:bg-[#3d5ee1] w-[30px] h-[30px] rounded-full flex justify-center items-center"
                                  onMouseEnter={() =>
                                    setIsHoverEdit(user.id_table)
                                  }
                                  onMouseLeave={() => setIsHoverEdit(0)}
                                  to={`/admin/users/edit/${user._id}`}
                                >
                                  <FiEdit2
                                    color={
                                      isHoverEdit === user.id_table
                                        ? "white"
                                        : "black"
                                    }
                                  />
                                </Link>
                                <button
                                  className="bg-[#f7f7fa] hover:bg-[#3d5ee1] w-[30px] h-[30px] rounded-full flex justify-center items-center"
                                  onMouseEnter={() =>
                                    setIsHoverDelete(user.id_table)
                                  }
                                  onMouseLeave={() => setIsHoverDelete(0)}
                                  onClick={() => handleDialog(user._id)}
                                >
                                  <RiDeleteBin6Line
                                    color={
                                      isHoverDelete === user.id_table
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
          <p>
            Mostrando {startRecord} a {endRecord} de {totalRecords} registro(s)
          </p>
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
              disabled={groupIndex === users.length - 1}
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
            handleAction={handleDelete}
            showLoading={showLoading}
            addCancel
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Users;
