import { useRef } from "react";
import { FaUserCircle, FaMapMarkerAlt } from "react-icons/fa";
import { formatDateShort } from "../utils/functions";
import { usePerfile } from "../hooks/usePerfile";

function Perfile() {
  const { user, fileInputRef, handleButtonClick, handleFileChange } = usePerfile()
  const dateInputRef = useRef(null);

  return (
    <>
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Perfil</h1>
      </header>
      <section className="bg-white drop-shadow-md">
        <div className="bg-[#f5f5f5] p-5 flex flex-row gap-5 items-center">
          {user?.imageperfile ? (
            <div className="rounded-full bg-white p-4 w-fit h-fit">
              <div className="min-w-20 min-h-20 max-w-20 max-h-20 rounded-full overflow-hidden">
                <img
                  src={user?.imageperfile}
                  alt="Image del perfil del usuario"
                  className="size-full"
                />
              </div>
            </div>
          ) : (
            <div className="rounded-full border-2 border-gray-300 p-2">
              <FaUserCircle
                color="gray"
                className="min-w-20 min-h-20 max-w-20 max-h-20"
              />
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium text-xl">{user?.firstname} {user?.lastnamepaternal} {user?.lastnamematernal}</p>
            <div className="flex flex-wrap gap-2 items-center mt-2">
              <FaMapMarkerAlt />
              <p className="font-normal text-base">
                {user?.address?.street}, {user?.address?.settlement},{" "}
                {user?.address?.postalcode}
              </p>
            </div>
          </div>
          <button className="bg-blue-700 text-white hover:bg-[#718bf3] rounded-md py-2 px-3" onClick={handleButtonClick}>
            Editar foto
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
        </div>
      </section>
      <article className="mt-10 gap-5 bg-white rounded-md p-5 h-fit">
        <header className="flex flex-row justify-between items-center">
          <h1 className="text-black font-medium text-xl">
            Detalles personales
          </h1>
        </header>
        <main className="flex flex-col gap-5">
          <span className="flex flex-row gap-5 items-center">
            <label className="text-gray-400 font-medium min-w-[150px] text-end">
              Nombre
            </label>
            <div className="flex flex-wrap flex-1 gap-2 gap-y-2">
              <input
                type="text"
                maxLength={20}
                defaultValue={user?.firstname}
                className="flex-1 px-4 py-3 text-gray-700 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                readOnly
              />
              <input
                type="text"
                maxLength={20}
                defaultValue={user?.lastnamepaternal}
                className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                readOnly
              />
              <input
                type="text"
                maxLength={20}
                defaultValue={user?.lastnamematernal}
                className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                readOnly
              />
            </div>
          </span>
          <span className="flex flex-row gap-5 items-center">
            <label className="text-gray-400 font-medium min-w-[150px] text-end">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              ref={dateInputRef}
              className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
              defaultValue={formatDateShort(user?.birthdate)}
              readOnly
            />
          </span>
          <span className="flex flex-row gap-5 items-center">
            <label className="text-gray-400 font-medium min-w-[150px] text-end">
              Email
            </label>
            <input
              type="email"
              maxLength={30}
              defaultValue={user?.email}
              className="flex-1 text-blue-500 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
              readOnly
            />
          </span>
          <span className="flex flex-row gap-5 items-center">
            <label className="text-gray-400 font-medium min-w-[150px] text-end">
              Teléfono
            </label>
            <input
              type="text"
              defaultValue={user?.phonenumber}
              className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
              readOnly
            />
          </span>
          <span className="flex flex-row gap-5 items-center">
            <label className="text-gray-400 font-medium min-w-[150px] text-end">
              Domicilio
            </label>
            <div className="flex flex-wrap flex-1 gap-2 gap-y-2">
              <input
                type="text"
                maxLength={30}
                defaultValue={user?.address?.street}
                className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                readOnly
              />
              <input
                type="text"
                maxLength={30}
                defaultValue={user?.address?.settlement}
                className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                readOnly
              />
              <input
                type="text"
                defaultValue={user?.address?.postalcode}
                className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                readOnly
              />
            </div>
          </span>
        </main>
      </article>
    </>
  );
}

export default Perfile;
