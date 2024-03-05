import { useViceprincipal } from "@context/ViceprincipalContext";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PostComponent from "@components/PostComponent";
import Dialog from "@components/Dialog";
import toast from "react-hot-toast";

function Posts() {
  const { getAllSomething, deleteSomething } = useViceprincipal();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showLoading, setShowLoading] = useState("");
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    if (loading) {
      async function getData() {
        try {
          const resPosts = await getAllSomething("post");
          if (resPosts?.length > 0) setPosts(resPosts);
          setLoading(false);
        } catch (error) {
          setPosts([]);
          setLoading(false);
        }
      }
      getData();
    }
  }, [loading]);

  const onDelete = async (id) => {
    try {
      const res = await deleteSomething(id, "post");
      if (res?.status === 200) {
        setPosts(posts.filter((post) => post.id!== id));
        toast.success("Aviso eliminado");
      }
      handleClickDelete("");
    } catch (error) {
      handleClickDelete("");
      toast.error("Error al eliminar el post. Por favor, intente nuevamente.");
    }
  };

  const handleDelete = (choose) => {
    if (!choose) return handleClickDelete("");
    setShowLoading("true");
    onDelete(postToDelete);
  }

  const handleClickDelete = (id) => {
    setPostToDelete(id);
    setShowLoading("");
    setShowDialog((prev) => !prev);
  }

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Avisos</h1>
      </header>
      <section
        className="flex-1 flex flex-wrap p-5 gap-6 bg-white rounded-lg overflow-y-auto justify-center"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#a5a5a5 transparent",
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {posts.map((post, i) => (
                <motion.div
                  className="max-w-[340px] max-h-[400px] w-full h-full"
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  layout
                >
                  <PostComponent data={post} handleDelete={handleClickDelete} />
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </section>
      <AnimatePresence>
        {showDialog && (
          <Dialog
            title="Eliminar aviso"
            textAccept="Eliminar"
            message="¿Está seguro de eliminar el aviso?"
            handleAction={handleDelete}
            showLoading={showLoading}
            addCancel
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Posts;
