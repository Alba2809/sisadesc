import { useEffect } from "react";
import { useCounselor } from "../../../hooks/useCounselor";
import { RiDeleteBin6Line } from "react-icons/ri";
import Dialog from "../../../components/Dialog";

function Counselors() {
  const {
    counselors,
    getCounselors,
    loading,
    dialogDelete,
    handleDialogDelete,
    handleActionDelete,
    isHoverRow,
    setIsHoverRow,
  } = useCounselor();

  useEffect(() => {
    getCounselors();
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Lista de asesores</h1>
      </header>
      <section className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto">
        <div className="flex-1 w-full overflow-x-auto mt-5 border border-gray-300">
          <table className="table-auto w-full min-w-[1300px] relative">
            <thead className="h-[50px] bg-[#f8f9fb] font-serif font-semibold">
              <tr>
                <th className="text-start px-2 w-[300px]">Nombre del asesor</th>
                <th className="text-start px-2 w-[200px]">CURP del asesor</th>
                <th className="text-start px-2 w-[200px]">RFC del asesor</th>
                <th className="px-2 w-[70px] text-center">Grado</th>
                <th className="px-2 w-[70px] text-center">Grup</th>
                <th className="text-center px-2 w-[100px] sticky -right-[1px] bg-[#f8f9fb] z-10">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="border-t text-gray-500">
                  <td className="p-2">Loading...</td>
                </tr>
              ) : counselors.length < 1 ? (
                <tr className="border-t text-gray-500">
                  <td colSpan="17" className="p-2">
                    No hay asesores registrados.
                  </td>
                </tr>
              ) : (
                <>
                  {counselors.map((counselor) => (
                    <tr
                      key={counselor.id}
                      className="border-y-[1px] border-gray-300 h-[60px] hover:bg-[#f7f7f7]"
                      onMouseEnter={() => setIsHoverRow(counselor.id)}
                      onMouseLeave={() => setIsHoverRow(null)}
                    >
                      <td className="p-2">{`${counselor.firstname} ${counselor.lastnamepaternal} ${counselor.lastnamematernal}`}</td>
                      <td className="p-2">{counselor.curp}</td>
                      <td className="p-2">{counselor.rfc}</td>
                      <td className="p-2 text-center">{counselor.grade}</td>
                      <td className="p-2 text-center">{counselor.group}</td>
                      <td
                        className={`p-2 sticky -right-[1px] ${
                          isHoverRow === counselor.id
                            ? "bg-[#f7f7f7]"
                            : "bg-white"
                        }`}
                      >
                        <div className=" flex gap-3 items-center justify-center">
                          {/* <Link
                            className="bg-[#f7f7fa] hover:bg-[#3d5ee1] w-[30px] h-[30px] rounded-full flex justify-center items-center"
                            to={`/admin/counselors/edit/${counselor.id}`}
                          >
                            <FiEdit2 color="black" />
                          </Link> */}
                          <button
                            className="bg-[#f7f7fa] hover:bg-[#3d5ee1] w-[30px] h-[30px] rounded-full flex justify-center items-center"
                            onClick={() => handleDialogDelete(counselor.id)}
                          >
                            <RiDeleteBin6Line color="black" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {dialogDelete && (
        <Dialog
          title={"Eliminar asesor"}
          message={"¿Está seguro de eliminar este asesor?"}
          handleAction={handleActionDelete}
        />
      )}
    </div>
  );
}

export default Counselors;
