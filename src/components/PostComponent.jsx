import { BiSolidBellRing } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { formatDateLong } from "../utils/functions";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function PostComponent({ data, handleDelete }) {
  const { user } = useAuth();

  const handleClickDelete = (id) => {
    if (handleDelete) handleDelete(id);
  };

  return (
    <article className="flex flex-col w-full h-full bg-white drop-shadow-md p-3">
      <header className="mb-2">
        <div className="flex flex-wrap gap-2 items-center">
          <BiSolidBellRing size="3em" />
          <div className="flex-1 flex flex-col">
            <p className="font-serif text-xs">PUBLICACIÓN DEL COLEGIO</p>
            <p className="font-serif text-sm font-bold">
              ESCUELA SECUNDARIA TÉCNICA
            </p>
            <p className="font-serif text-xs">NIVEL SECUNDARIA</p>
          </div>
        </div>
        <div className="">
          <h1 className="font-bold font-sans text-2xl">{data.title}</h1>
          <p className="font-sans text-xs">{formatDateLong(data.createdAt)}</p>
        </div>
      </header>
      <section
        className="h-full overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#a5a5a5 transparent",
        }}
      >
        <p className="font-serif text-sm">{data.description}</p>
      </section>
      {/* user logged hava access to edit and delete (roles accepted are "secretary" and "viceprincipal") */}
      {["secretary", "viceprincipal"].includes(user?.role.name) && (
        <footer className="flex gap-2 items-center mt-3">
          <Link
            className="bg-[#f7f7fa] hover:bg-[#3d5ee1] w-[30px] h-[30px] rounded-full flex justify-center items-center"
            to={`/${user?.role.name}/posts/edit/${data.id}`}
          >
            <FiEdit2 color="black" />
          </Link>
          <button
            className="bg-[#f7f7fa] hover:bg-[#3d5ee1] w-[30px] h-[30px] rounded-full flex justify-center items-center"
            onClick={() => handleClickDelete(data.id)}
          >
            <RiDeleteBin6Line color="black" />
          </button>
        </footer>
      )}
    </article>
  );
}

export default PostComponent;
