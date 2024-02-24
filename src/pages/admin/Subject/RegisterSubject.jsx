import { useAdmin } from "@context/AdminContext";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa";
import { grades, groups } from "@constants/constants";
import Dialog from "@components/Dialog";
import AlertMessage from "@components/AlertMessage";
import InputSelect from "@components/InputSelect";

function RegisterSubject() {
  const { registerSomething, errors: registerErrors } = useAdmin();
  const [showDialog, setShowDialog] = useState(false);
  const [showLoading, setShowLoading] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    try {
      handleDialog();
      const res = await registerSomething(data, "subject");
      handleDialog();
      if (res?.statusText === "OK") navigate("/admin/subjects");
    } catch (error) {
      handleDialog();
    }
  });

  const handleDialog = () => {
    setShowLoading((prev) => (prev === "" ? "true" : ""));
    setShowDialog((prev) => !prev);
  };

  const handleChangeSelect = (value, name) => setValue(name, value);

  useEffect(() => {
    setValue("grade", grades[0]);
    setValue("group", groups[0]);
  }, []);

  return (
    <div className="w-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Agregar materia</h1>
      </header>
      <section
        className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto min-h-[500px]"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#a5a5a5 transparent",
        }}
      >
        <AnimatePresence mode="sync">
          {registerErrors.map((error, i) => (
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
          className="flex flex-wrap justify-stretch gap-5 gap-y-8 mt-5"
        >
          <h2 className="w-full font-medium font-serif text-xl">
            Información de la materia
          </h2>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Nombre de la materia<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={20}
              {...register("name", {
                required: "Se requiere el nombre",
                maxLength: {
                  value: 20,
                  message: "El nombre no debe exceder los 20 caracteres",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Código<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={10}
              {...register("code", {
                required: "Se requiere el código",
                maxLength: {
                  value: 10,
                  message: "El código no debe exceder los 10 caracteres",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Grupo<span className="text-red-500">*</span>
            </label>
            <InputSelect
              options={groups}
              onOptionChange={handleChangeSelect}
              object="group"
              style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Grado<span className="text-red-500">*</span>
            </label>
            <InputSelect
              options={grades}
              onOptionChange={handleChangeSelect}
              object="grade"
              style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              CURP del docente
            </label>
            <input
              type="text"
              maxLength={18}
              {...register("teacher", {
                required: false,
                maxLength: {
                  value: 18,
                  message: "La CURP no debe exceder los 18 caracteres",
                },
                pattern: {
                  value: /^[A-ZÑ]{4}[0-9]{6}[A-ZÑ]{6,7}[0-9]{1,2}$/,
                  message:
                    "CURP inválido. Verifique el formato y que las letras sean mayúsculas.",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <section className="w-full">
            <button
              type="submit"
              className="py-2 px-8 bg-blue-600 hover:bg-[#18aefa] text-white text-lg rounded-lg"
            >
              Guardar
            </button>
          </section>
        </form>
      </section>
      <AnimatePresence>
        {showDialog && (
          <Dialog
            title="Realizando registro"
            textAccept="Registrando"
            message=""
            showLoading={showLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default RegisterSubject;
