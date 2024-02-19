import { useAdmin } from "@context/AdminContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputSelect from "@components/InputSelect";
import Dialog from "@components/Dialog";
import AlertMessage from "@components/AlertMessage";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

function RegisterUser() {
  const {
    getAllSomething,
    registerSomething,
    errors: registerErrors,
  } = useAdmin();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seePassword, setSeePassword] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showLoading, setShowLoading] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      const rolesData = await getAllSomething("role");
      setRoles(rolesData);
      setValue("role", rolesData[0].id);
      setLoading(false);
    }
    getUser();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      handleDialog();
      const res = await registerSomething(data, "user");
      handleDialog();
      if (res?.statusText === "OK") navigate("/admin/users");
    } catch (error) {
      handleDialog();
    }
  });

  const handleDialog = () => {
    setShowLoading((prev) => (prev === "" ? "true" : ""));
    setShowDialog((prev) => !prev);
  };

  const handleChangeRole = (value) => {
    const rol = roles.find((role) => role.name === value);
    if (rol) return setValue("role", rol.id);
    setValue("role", null);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Registrar usuario</h1>
      </header>
      <section className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
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
                  maxLength={18}
                  {...register("curp", {
                    required: "Se requiere el CURP",
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
              <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  RFC
                </label>
                <input
                  type="text"
                  maxLength={13}
                  {...register("rfc", {
                    maxLength: {
                      value: 13,
                      message: "El RFC no debe exceder los 13 caracteres",
                    },
                    pattern: {
                      value: /^[A-ZÑ]{4}[0-9]{6}[A-ZÑ0-9]{0,}$/,
                      message:
                        "RFC inválido. Verifique el formato y que las letras sean mayúsculas.",
                    },
                  })}
                  className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
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
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Rol<span className="text-red-500">*</span>
                </label>
                <InputSelect
                  options={roles.map((rol) => rol.name)}
                  onOptionChange={handleChangeRole}
                  style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                />
              </div>
              <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Contraseña<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={seePassword === "password" ? "text" : "password"}
                    placeholder="Contraseña"
                    maxLength={25}
                    {...register("password", {
                      required: "Se requiere la contraseña",
                      maxLength: {
                        value: 25,
                        message:
                          "La contraseña no debe exceder los 25 caracteres",
                      },
                      minLength: {
                        value: 8,
                        message:
                          "La contraseña debe tener al menos 8 caracteres",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])/,
                        message:
                          "La contraseña debe contener al menos una letra mayúscula y una minúscula",
                      },
                    })}
                    className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  />
                  {seePassword === "password" ? (
                    <IoEyeOffOutline
                      className="absolute top-[25%] right-3 cursor-pointer"
                      size="1.5em"
                      onClick={() => setSeePassword("")}
                    />
                  ) : (
                    <IoEyeOutline
                      className="absolute top-[25%] right-3 cursor-pointer"
                      size="1.5em"
                      onClick={() => setSeePassword("password")}
                    />
                  )}
                </div>
              </div>
              <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Confirme la contraseña<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={
                      seePassword === "passwordConfirm" ? "text" : "password"
                    }
                    placeholder="Contraseña"
                    maxLength={25}
                    {...register("passwordConfirm", {
                      required: "Se requiere que confirme la contraseña",
                      validate: (value) =>
                        value === getValues("password") ||
                        "Las contraseñas no coinciden",
                    })}
                    className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  />
                  {seePassword === "passwordConfirm" ? (
                    <IoEyeOffOutline
                      className="absolute top-[25%] right-3 cursor-pointer"
                      size="1.5em"
                      onClick={() => setSeePassword("")}
                    />
                  ) : (
                    <IoEyeOutline
                      className="absolute top-[25%] right-3 cursor-pointer"
                      size="1.5em"
                      onClick={() => setSeePassword("passwordConfirm")}
                    />
                  )}
                </div>
              </div>
              <section className="w-full">
                <button
                  type="submit"
                  className="py-2 px-8 bg-blue-600 hover:bg-[#18aefa] text-white text-lg rounded-lg"
                >
                  Registrar
                </button>
              </section>
            </form>
          </>
        )}
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

export default RegisterUser;
