import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePost } from "../../../hooks/usePost";
import PostComponent from "../../../components/PostComponent";
import Dialog from "../../../components/Dialog";

function Posts() {
  const { deletePost, getPosts, handleDialog, loading, postToDelete, showDialog, posts, setPosts } = usePost()

  useEffect(() => {
    getPosts();
  }, []);

  const handleActionDialog = async (accept) => {
    if (!accept) return handleDialog(null)

    if (postToDelete){
      const res = await deletePost(postToDelete);
      if (res?.status === 200) {
        const newObjects = posts.filter(obj => obj.id!== postToDelete);
        setPosts(newObjects);
        handleDialog(null);
      }
    }
  };

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
                  <PostComponent data={post} handleDelete={handleDialog} />
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
            handleAction={handleActionDialog}
            addCancel
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Posts;
