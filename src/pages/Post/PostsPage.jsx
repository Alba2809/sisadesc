import { usePost } from "@context/PostContext";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PostComponent from "@components/PostComponent";

function PostsPage() {
  const { getPosts, posts } = usePost();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      async function getData() {
        await getPosts();
        setLoading(false);
      }
      getData();
    }
  }, [loading]);

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
            {posts.length === 0 && (
              <p className="text-center">No hay avisos.</p>
            )}
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
                  <PostComponent data={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </section>
    </div>
  );
}

export default PostsPage;
