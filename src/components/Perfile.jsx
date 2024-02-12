import { useAuth } from "@context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserCircle, FaMapMarkerAlt, FaRegEdit } from "react-icons/fa";
import { formatDateShort } from "@constants/functions";

const skills = [
  "Html5",
  "CSS3",
  "WordPress",
  "Javascript",
  "Android",
  "iOS",
  "Angular",
  "PHP",
];

function Perfile() {
  const { getUser, user } = useAuth();
  const [menuSelected, setMenuSelected] = useState("About me");
  const dateInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  useEffect(() => {
    async function getUserData() {
      const res = await getUser();
      setValue("firstname", res.firstname);
      setValue("lastnamepaternal", res.lastnamepaternal);
      setValue("lastnamematernal", res.lastnamematernal);
      setValue("birthdate", res.birthdate);
      setValue("email", res.email);
      setValue("phonenumber", res.phonenumber);
      setValue("street", res.direction.street);
      setValue("colony", res.direction.colony);
      setValue("postalcode", res.direction.postalcode);
    }
    getUserData();
  }, []);

  const handleMenuOption = (option) => {
    if (option !== menuSelected) setMenuSelected(option);
  };

  const handleDateInput = (e) => {
    setValue("birthdate", e.target.value);
  };

  const handleChangeInput = (e, name, type) => {
    let value = null;
    if (type === "number") value = e.target.value.replace(/[^0-9]/g, "");
    setValue(name, value ?? e.target.value);
  };

  return (
    <>
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Perfil</h1>
      </header>
      <section className="bg-white drop-shadow-md">
        <div className="bg-[#f5f5f5] p-5 flex flex-row gap-5 items-center">
          {user?.imageperfile ? (
            <div className="rounded-full bg-white p-4 w-fit h-fit">
              <img
                src={user.imageperfile}
                alt="Image del perfil del usuario"
                className="min-w-20 min-h-20 max-w-20 max-h-20 rounded-full"
              />
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
            <p className="font-medium text-xl">{user?.firstname}</p>
            <p className="font-medium text-lg">{user?.lastnamepaternal}</p>
            <p className="font-medium text-lg">{user?.lastnamematernal}</p>
            <div className="flex flex-wrap gap-2 items-center mt-2">
              <FaMapMarkerAlt />
              <p className="font-normal text-base">
                {user?.direction?.street}, {user?.direction?.colony},{" "}
                {user?.direction?.postalcode}
              </p>
            </div>
          </div>
          <button className="bg-blue-700 text-white hover:bg-[#718bf3] rounded-md py-2 px-3">
            Editar
          </button>
        </div>
        <div className="p-5 flex flex-row gap-3">
          <motion.button
            className={`relative w-[100px] h-[30px]`}
            onClick={() => handleMenuOption("About me")}
          >
            {menuSelected === "About me" && (
              <motion.div
                className="bg-blue-700 absolute w-full h-full left-0 top-0 pointer-events-none z-10"
                transition={{ delay: 0, duration: 0.2 }}
                layoutId="sideline"
              />
            )}
            <p
              className={`absolute z-20 w-full h-full left-0 top-[5%] ${
                menuSelected === "About me" ? "text-white" : "text-black"
              }`}
            >
              Sobre me
            </p>
          </motion.button>
          <motion.button
            className={`relative w-[100px] h-[30px]`}
            onClick={() => handleMenuOption("Password")}
          >
            {menuSelected === "Password" && (
              <motion.div
                className="bg-blue-700 absolute w-full h-full left-0 top-0 pointer-events-none z-10"
                transition={{ delay: 0, duration: 0.2 }}
                layoutId="sideline"
              />
            )}
            <p
              className={`absolute z-20 w-full h-full left-0 top-[5%] ${
                menuSelected === "Password" ? "text-white" : "text-black"
              }`}
            >
              Contraseña
            </p>
          </motion.button>
        </div>
      </section>
        {menuSelected === "About me" ? (
          <article
            className="flex-1 max-h-[490px] grid grid-cols-3 grid-rows-3 mt-10 gap-5"
          >
            <section className="col-span-2 row-span-3 bg-white rounded-md p-5">
              <header className="flex flex-row justify-between items-center">
                <h1 className="text-black font-medium text-xl">
                  Detalles personales
                </h1>
                <button className="flex flex-row items-center justify-center text-gray-500">
                  <FaRegEdit color="gray" />
                  Editar
                </button>
              </header>
              <form className="flex flex-col gap-5 overflow-y-auto max-h-[400px]" style={{ scrollbarWidth: "thin", scrollbarColor: "#f1f1f1 transparent"}}>
                <span className="flex flex-row gap-5 items-center">
                  <label className="text-gray-400 font-medium min-w-[150px] text-end">
                    Nombre
                  </label>
                  <div className="flex flex-wrap flex-1 gap-2 gap-y-2">
                    <input
                      type="text"
                      maxLength={20}
                      {...register("firstname", {
                        required: "Se requiere el nombre",
                        maxLength: {
                          value: 20,
                          message:
                            "El nombre no debe exceder los 20 caracteres",
                        },
                      })}
                      className="flex-1 px-4 py-3 text-gray-700 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                    />
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
                      className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                    />
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
                      className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                    />
                  </div>
                </span>
                <span className="flex flex-row gap-5 items-center">
                  <label className="text-gray-400 font-medium min-w-[150px] text-end">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    {...register("birthdate", {
                      required: "Se requiere la fecha de nacimiento",
                    })}
                    onChange={handleDateInput}
                    ref={dateInputRef}
                    className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                    defaultValue={formatDateShort(user.birthdate ?? new Date())}
                  />
                </span>
                <span className="flex flex-row gap-5 items-center">
                  <label className="text-gray-400 font-medium min-w-[150px] text-end">
                    Email
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
                    className="flex-1 text-blue-500 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                  />
                </span>
                <span className="flex flex-row gap-5 items-center">
                  <label className="text-gray-400 font-medium min-w-[150px] text-end">
                    Teléfono
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
                    className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                    onChange={(e) =>
                      handleChangeInput(e, "phonenumber", "number")
                    }
                    min={0}
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
                      {...register("street", {
                        required: "Se requiere la calle",
                        maxLength: {
                          value: 30,
                          message: "La calle no debe exceder los 30 caracteres",
                        },
                      })}
                      className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                    />
                    <input
                      type="text"
                      maxLength={30}
                      {...register("colony", {
                        required: "Se requiere la colonia",
                        maxLength: {
                          value: 30,
                          message:
                            "La colonia no debe exceder los 30 caracteres",
                        },
                      })}
                      className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                    />
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
                          message:
                            "El código postal no debe exceder los 5 caracteres",
                        },
                        min: {
                          value: 1,
                          message: "Código postal inválido",
                        },
                      })}
                      className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                      onChange={(e) =>
                        handleChangeInput(e, "postalcode", "number")
                      }
                      min={0}
                    />
                  </div>
                </span>
              </form>
            </section>
            <section className="bg-white rounded-md p-5 flex flex-col gap-2">
              <header className="flex flex-row justify-between items-center">
                <h1 className="text-black font-medium text-xl">
                  Estatus de la cuenta
                </h1>
              </header>
              <div className="bg-[#7fb03d] text-white px-3 py-2 w-fit rounded-md">
                Activo
              </div>
            </section>
            <article className="row-span-2 bg-white rounded-md p-5 flex flex-col gap-2">
              <header className="flex flex-row justify-between items-center">
                <h1 className="text-black font-medium text-xl">Habilidades</h1>
                <button className="flex flex-row items-center justify-center text-gray-500">
                  <FaRegEdit color="gray" />
                  Editar
                </button>
              </header>
              <section className="flex flex-wrap overflow-y-auto max-h-full gap-2">
                {skills.map((skill, i) => (
                  <div
                    key={i}
                    className="bg-[#f4f4f4] text-sm rounded-md h-fit p-3"
                  >
                    {skill}
                  </div>
                ))}
              </section>
            </article>
          </article>
        ) : (
          <article
            className="flex-1 max-h-[490px] mt-10 gap-5 bg-white rounded-md p-5"
          >
            <h1 className="text-black font-medium text-xl">
              Cambiar contraseña
            </h1>
            <form className="flex flex-col gap-y-4 overflow-y-auto max-h-full">
              <span className="flex flex-col">
                <label>Contraseña anterior</label>
                <input
                  type="password"
                  maxLength={25}
                  {...register("passwordOld", {
                    required: "Se requiere la contraseña",
                    maxLength: {
                      value: 25,
                      message: "No debe exceder los 25 caracteres",
                    },
                    minLength: {
                      value: 6,
                      message: "Debe tener al menos 6 caracteres",
                    },
                  })}
                  className="w-full max-w-[400px] text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                />
              </span>
              <span className="flex flex-col">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  maxLength={25}
                  {...register("passwordNew", {
                    required: "Se requiere la contraseña",
                    maxLength: {
                      value: 25,
                      message: "No debe exceder los 25 caracteres",
                    },
                    minLength: {
                      value: 6,
                      message: "Debe tener al menos 6 caracteres",
                    },
                  })}
                  className="w-full max-w-[400px] text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                />
              </span>
              <span className="flex flex-col">
                <label>Confirmar la contraseña</label>
                <input
                  type="password"
                  maxLength={25}
                  {...register("passwordConfirm", {
                    required: "Se requiere que confirme la contraseña",
                    validate: (value) =>
                      value === getValues("passwordNew") ||
                      "Las contraseñas no coinciden",
                  })}
                  className="w-full max-w-[400px] text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                />
              </span>
              <button
                type="submit"
                className="py-2 px-8 bg-blue-600 hover:bg-[#18aefa] text-white text-lg rounded-lg max-w-[150px]"
              >
                Guardar
              </button>
            </form>
          </article>
        )}
    </>
  );
}

export default Perfile;
