import { useAdmin } from "@context/AdminContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { genders } from "@constants/constants";
import InputSelect from "@components/InputSelect";
import Dialog from "@components/Dialog";
import AlertMessage from "@components/AlertMessage";

const subjectsTest = ["Matemáticas", "Español", "Ciencias", "Inglés", "Ética"];

function RegisterStudent() {
  const {
    registerSomething,
    getAllSomething,
    errors: registerErrors,
  } = useAdmin();
  const dateInputRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showLoading, setShowLoading] = useState("");
  const [subjects, setSubjects] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      const res = await getAllSomething("subject");
      if (res) setSubjects(res.map(value => value.name));
    }
    setValue("gender", genders[0]);
    setValue("subjects", []);
    getData();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      handleDialog();
      const res = await registerSomething(data, "student");
      handleDialog();
      if (res?.statusText === "OK") navigate("/admin/students");
    } catch (error) {
      handleDialog();
    }
  });

  const handleDialog = () => {
    setShowLoading((prev) => (prev === "" ? "true" : ""));
    setShowDialog((prev) => !prev);
  };

  const handleChangeGender = (value) => {
    setValue("gender", value);
  };

  const handleAddSubject = (value) => {
    const subjectExists = subjects.includes(value);
    if (subjectExists) {
      const repeatSubject = getValues("subjects").includes(value);
      if (!repeatSubject)
        setValue("subjects", [...getValues("subjects"), value]);
    }
  };

  const handleDeleteSubject = (value) => {
    const subjectExists = subjects.includes(value);
    if (subjectExists) {
      setValue("subjects", getValues("subjects").filter(subject => subject !== value));
    }
  };

  const handleChangeInput = (e, name, type) => {
    let value = null;
    if (type === "number") value = e.target.value.replace(/[^0-9]/g, "");
    setValue(name, value ?? e.target.value);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Agregar estudiante</h1>
      </header>
      <section className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto">
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
            Detalles básicos
          </h2>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Nombre<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={20}
              {...register("firstname", {
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
              Primer apellido<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={20}
              {...register("lastnamepaternal", {
                required: "Se requiere el primer apellido",
                maxLength: {
                  value: 20,
                  message:
                    "El primer apellido no debe exceder los 20 caracteres",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Segundo apellido<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={20}
              {...register("lastnamematernal", {
                required: "Se requiere el segundo apellido",
                maxLength: {
                  value: 20,
                  message:
                    "El segundo apellido no debe exceder los 20 caracteres",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              CURP<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={13}
              {...register("curp", {
                required: "Se requiere el CURP",
                maxLength: {
                  value: 13,
                  message: "La CURP no debe exceder los 13 caracteres",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Género<span className="text-red-500">*</span>
            </label>
            <InputSelect
              options={genders}
              onOptionChange={handleChangeGender}
              style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Fecha de nacimiento<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("birthdate", {
                required: "Se requiere la fecha de nacimiento",
              })}
              onChange={(e) => handleChangeInput(e, "birthdate")}
              ref={dateInputRef}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <h2 className="w-full font-medium font-serif text-xl">Dirección</h2>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Calle<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={30}
              {...register("street", {
                required: "Se requiere la calle",
                maxLength: {
                  value: 30,
                  message: "La calle no debe exceder los 30 caracteres",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Colonia<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={30}
              {...register("colony", {
                required: "Se requiere la colonia",
                maxLength: {
                  value: 30,
                  message: "La colonia no debe exceder los 30 caracteres",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Código postal<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={5}
              {...register("postalcode", {
                required: "Se requiere el código postal",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Solo se permiten números",
                },
                maxLength: {
                  value: 5,
                  message: "El código postal no debe exceder los 5 caracteres",
                },
                min: {
                  value: 1,
                  message: "Código postal inválido",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
              onChange={(e) => handleChangeInput(e, "postalcode", "number")}
              min={0}
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              maxLength={30}
              {...register("email", {
                required: "Se requiere el email",
                maxLength: {
                  value: 30,
                  message: "El email no debe exceder los 30 caracteres",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            {subjects ? (
              <>
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Asignatura<span className="text-red-500">*</span>
                </label>
                <InputSelect
                  options={subjects}
                  onOptionChange={handleAddSubject}
                  onOptionDelete={handleDeleteSubject}
                  style="pl-4 pr-10 py-2 border border-gray-300 min-h-[50px]"
                  styleArrow="top-[30%]"
                  multiOption
                />
              </>
            ) : (
              <p>Loading</p>
            )}
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Grupo<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={30}
              {...register("group", {
                required: "Se requiere la calle",
                maxLength: {
                  value: 30,
                  message: "La calle no debe exceder los 30 caracteres",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Teléfono<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={10}
              minLength={10}
              {...register("phonenumber", {
                required: "Se requiere el código postal",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Solo se permiten números",
                },
                maxLength: {
                  value: 10,
                  message: "El teléfono debe tener 10 números",
                },
                minLength: {
                  value: 10,
                  message: "El teléfono debe tener 10 números",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
              onChange={(e) => handleChangeInput(e, "phonenumber", "number")}
              min={0}
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

export default RegisterStudent;
