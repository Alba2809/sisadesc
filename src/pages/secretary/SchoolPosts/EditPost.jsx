import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { usePost } from "../../../hooks/usePost";
import AlertMessage from "../../../components/AlertMessage";

function EditPost() {
  const params = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { updatePost, errors: updateErrors, getPost } = usePost({ setValue })

  useEffect(() => {
    getPost(params.id);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    const res = await updatePost(params.id, data);
    if (res?.statusText === "OK") navigate("/secretary/posts");
  });

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Editar aviso</h1>
      </header>
      <section
        className="flex-1 flex flex-col p-10 bg-white rounded-lg overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#a5a5a5 transparent",
        }}
      >
        <AnimatePresence mode="sync">
          {updateErrors.map((error, i) => (
            <motion.div
              key={i}
              initial={{ height: 0, y: -10, opacity: 0 }}
              animate={{ height: 48, y: 0, opacity: 1 }}
              exit={{ height: 0, y: -10, opacity: 0 }}
              transition={{ type: "spring", delay: i * 0.2 }}
            >
              <AlertMessage key={i} message={error} />
            </motion.div>
          ))}
          {Object.keys(errors).map((fieldName, i) => (
            <motion.div
              key={fieldName}
              initial={{ height: 0, y: -10, opacity: 0 }}
              animate={{ height: 48, y: 0, opacity: 1 }}
              exit={{ height: 0, y: -10, opacity: 0 }}
              transition={{ type: "spring", delay: i * 0.2 }}
            >
              <AlertMessage
                key={fieldName}
                message={errors[fieldName].message}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-stretch gap-5 gap-y-8 mt-5"
        >
          <div className="relative flex-1">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Título<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={200}
              {...register("title", {
                required: "Se requiere el título",
                maxLength: {
                  value: 200,
                  message: "El título no debe exceder los 200 caracteres",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Descripción del aviso<span className="text-red-500">*</span>
            </label>
            <textarea
              maxLength={1000}
              {...register("description", {
                required: "Se requiere la descripción",
                maxLength: {
                  value: 1000,
                  message: "La descripción no debe exceder los 1000 caracteres",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none resize-none"
              rows={15}
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#a5a5a5 transparent",
              }}
            />
          </div>
          <section className="w-full">
            <button
              type="submit"
              className="py-2 px-8 bg-blue-600 hover:bg-[#18aefa] text-white text-lg rounded-lg"
            >
              Publicar
            </button>
          </section>
        </form>
      </section>
    </div>
  );
}

export default EditPost;
