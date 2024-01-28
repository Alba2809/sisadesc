import { useAdmin } from "@context/AdminContext";
import { Fragment, useEffect, useState } from "react";
import InputSelect from "@components/InputSelect";

function Users() {
  const { getAllSomething } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupSize, setGroupsSize] = useState(5);
  const [groupIndex, setGroupIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (loading) {
      async function getUsers() {
        const res = await getAllSomething("user");
        if (res) {
          setAllUsers(res);
          setUsers(groupUsers(res));
        }
        setLoading(false);
      }
      getUsers();
    }
  }, [loading]);

  const groupUsers = (value) =>{
    return Array.from(
        { length: Math.ceil(value.length / groupSize) },
        (_, index) =>
          value.slice(index * groupSize, (index + 1) * groupSize)
      )
  }

  const onOptionChange = (number) => setGroupsSize(Number.parseInt(number));

  const handleNext = () => {
    setGroupIndex((prevIndex) =>
      Math.min(prevIndex + 1, groupedUsers.length - 1)
    );
  };

  const handleBack = () => {
    setGroupIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const startRecord = groupIndex * groupSize + 1;
  const endRecord = Math.min((groupIndex + 1) * groupSize, users.length);
  const totalRecords = allUsers.length;

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const filteredUsers = users.filter((user) =>
        Object.values(user).some(
          (value) =>
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

  return (
    <div className="w-full h-full p-10">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Lista de usuarios</h1>
      </header>
      <section className="p-5 bg-white rounded-lg">
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
        <div className="w-full overflow-x-auto mt-5">
          <table className="table-auto border-collapse border border-gray-300 w-full min-w-[1300px]">
            <thead className="h-[50px] bg-[#f8f9fb] font-serif font-semibold">
              <tr>
                <th className="text-start px-2 w-[250px]">ID</th>
                <th className="text-start px-2">Perfil</th>
                <th className="text-start px-2">Nombre</th>
                <th className="text-start px-2">Primer apellido</th>
                <th className="text-start px-2">Segundo apellido</th>
                <th className="text-start px-2">CURP</th>
                <th className="text-start px-2">RFC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="border border-gray-300">
                  <td className="p-2">Loading...</td>
                </tr>
              ) : allUsers.length < 1 ? (
                <tr className="border border-gray-300">
                  <td className="p-2">No hay usuarios registrados.</td>
                </tr>
              ) : (
                users.map((group, groupIndex) => (
                  <Fragment key={groupIndex}>
                    {group.map((user, userIndex) => (
                      <tr
                        key={`${groupIndex}-${userIndex}`}
                        className="border border-gray-300 h-[60px]"
                      >
                        <td className="p-2">{`${groupIndex}${
                          userIndex + 1
                        }`}</td>
                        <td className="p-2">{user.imageperfile}</td>
                        <td className="p-2">{user.firstname}</td>
                        <td className="p-2">{user.lastnamepaternal}</td>
                        <td className="p-2">{user.lastnamematernal}</td>
                        <td className="p-2">{user.curp}</td>
                        <td className="p-2">{user.rfc}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        <footer className="flex flex-row justify-between pt-3 items-center">
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
    </div>
  );
}

export default Users;
