import { useAdmin } from "@context/AdminContext";
import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import UserIcon from "@images-icons/user-icon.svg";
import AwardIcon1 from "@images-icons/award-icon1.svg";
import AwardIcon2 from "@images-icons/award-icon2.svg";

function ControlAdmin() {
  const { getAllSomething } = useAdmin();
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTotalStudents() {
      const res = await getAllSomething("student");
      setStudents(res);
      setLoading(false);
    }
    if (loading) getTotalStudents();
  }, [loading]);

  return (
    <div className="overflow-y-auto">
      <article className="flex flex-row items-center gap-5 bg-white rounded-md p-5 w-fit">
        <section>
          <h2 className="font-medium text-gray-400 text-base">Estudiantes</h2>
          <p className="font-bold text-black text-lg">{students?.length}</p>
        </section>
        <img src={UserIcon} alt="Icono de estudiante" className="w-[80px]" />
      </article>
      <article className="bg-white rounded-md p-5 w-fit mt-10">
        <header className="flex flex-row justify-between mb-5">
          <h1 className="font-bold text-black text-lg">
            Actividad de los estudiantes
          </h1>
          <button className="bg-[#eff4f7] text-black font-extrabold text-xl px-3 py-2 rounded-md flex items-center justify-center">
            <IoMenu />
          </button>
        </header>
        <section className="flex flex-col gap-y-10 justify-center max-h-[400px] overflow-y-auto">
          <article className="w-full flex flex-row items-center gap-3">
            <div className="bg-[#edf4fe] p-2 rounded-md flex items-center justify-center">
              <img
                src={AwardIcon1}
                alt="Icono de premio - 1"
                className="row-span-2 min-w-[30px] max-w-[30px]"
              />
            </div>
            <div className="break-words max-w-[385px]">
              <h1 className="font-medium text-base text-gray-600">
                Primer lugar en "Ajedrez"
              </h1>
              <p className="text-base text-gray-400">
                Emiliano Hernández ganó el primer lugar en "Ajedrez"
              </p>
            </div>
            <p className="bg-[#fff8ec] p-1 rounded-md text-gray-400 text-sm h-fit break-words">
              Hace un día
            </p>
          </article>
          <article className="w-full flex flex-row items-center gap-3">
            <div className="bg-[#edf4fe] p-2 rounded-md flex items-center justify-center">
              <img
                src={AwardIcon2}
                alt="Icono de premio - 2"
                className="row-span-2 min-w-[30px] max-w-[30px]"
              />
            </div>
            <div className="break-words max-w-[385px]">
              <h1 className="font-medium text-base text-gray-600">
                Olimpiadas de "Matemáticas"
              </h1>
              <p className="text-base text-gray-400">
                Wendy Martínez participó en las olimpiadas de matemáticas
              </p>
            </div>
            <p className="bg-[#fff8ec] p-1 rounded-md text-gray-400 text-sm h-fit break-words text-center">
              Hace dos horas
            </p>
          </article>
        </section>
      </article>
    </div>
  );
}

export default ControlAdmin;
