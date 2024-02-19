import { useAuth } from "@context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserCircle, FaMapMarkerAlt, FaRegEdit } from "react-icons/fa";
import { formatDateShort } from "@constants/functions";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import AlertMessage from "@components/AlertMessage"
import Dialog from "@components/Dialog"

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
  const { getUser, updatePassword, user, errors: updateErrors } = useAuth();
  const [loading, setLoading] = useState(true)
  const [menuSelected, setMenuSelected] = useState("About me");
  const [success, setSuccess] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showLoading, setShowLoading] = useState("");
  const [seeOldPassword, setSeeOldPassword] = useState(false);
  const [seeNewPassword, setSeeNewPassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const dateInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    unregister
  } = useForm();

  useEffect(() => {
    async function getUserData() {
      await getUser();
      setLoading(false)
    }
    if(loading) getUserData();
  }, [loading]);

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

  const onSubmit = handleSubmit(async (data) => {
    try {
      handleDialog();
      const res = await updatePassword(data);
      if (res?.statusText === "OK"){
        setSuccess(true);
        setValue("oldPassword", "")
        setValue("newPassword", "")
        setValue("confirmPassword", "")
        unregister(["oldPassword", "newPassword", "confirmPassword"])
      }
      handleDialog();
    } catch (error) {
      handleDialog();
    }
  });

  const handleDialog = () => {
    setShowLoading((prev) => (prev === "" ? "true" : ""));
    setShowDialog((prev) => !prev);
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
                {user?.address?.street}, {user?.address?.settlement},{" "}
                {user?.address?.postalcode}
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
                {/* <button className="flex flex-row items-center justify-center text-gray-500">
                  <FaRegEdit color="gray" />
                  Editar
                </button> */}
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
                    onChange={handleDateInput}
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
                    maxLength={10}
                    minLength={10}
                    defaultValue={user?.phonenumber}
                    className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                    onChange={(e) =>
                      handleChangeInput(e, "phonenumber", "number")
                    }
                    min={0}
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
                      maxLength={5}
                      defaultValue={user?.address?.postalcode}
                      className="flex-1 text-gray-700 px-4 py-3 bg-transparent border-b border-transparent focus:border-blue-400 focus:border-b focus:outline-none"
                      onChange={(e) =>
                        handleChangeInput(e, "postalcode", "number")
                      }
                      min={0}
                      readOnly
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
              {success && (
                <motion.div
                  initial={{ height: 0, y: -10, opacity: 0 }}
                  animate={{ height: 48, y: 0, opacity: 1 }}
                  exit={{ height: 0, y: -10, opacity: 0 }}
                  transition={{ type: "spring" }}
                >
                  <AlertMessage
                    message="Se ha actualizado la contraseña exitosamente."
                    colorIcon="green"
                    colorBg="bg-green-600/10"
                    colorLeftBorder="border-green-600"
                    colorText="text-green-600"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <form onSubmit={onSubmit} className="flex flex-col gap-y-4 overflow-y-auto max-h-full">
              <span className="flex flex-col">
                <label>Contraseña actual</label>
                <div className="relative max-w-[400px]">
                  <input
                    type={seeOldPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    maxLength={25}
                    {...register("oldPassword", {
                      required: "Se requiere la contraseña actual",
                      maxLength: {
                        value: 25,
                        message: "No debe exceder los 25 caracteres",
                      },
                      minLength: {
                        value: 8,
                        message: "Debe tener al menos 8 caracteres",
                      },
                    })}
                    className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  />
                  {seeOldPassword ? (
                    <IoEyeOffOutline
                      className="absolute top-[25%] right-3 cursor-pointer"
                      size="1.5em"
                      onClick={() => setSeeOldPassword(prev => !prev)}
                    />
                  ) : (
                    <IoEyeOutline
                      className="absolute top-[25%] right-3 cursor-pointer"
                      size="1.5em"
                      onClick={() => setSeeOldPassword(prev => !prev)}
                    />
                  )}
                </div>
              </span>
              <span className="flex flex-col">
                <label>Nueva contraseña</label>
                <div className="relative max-w-[400px]">
                  <input
                    type={seeNewPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    maxLength={25}
                    {...register("newPassword", {
                      required: "Se requiere la contraseña nueva",
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
                  {seeNewPassword ? (
                    <IoEyeOffOutline
                      className="absolute top-[25%] right-3 cursor-pointer"
                      size="1.5em"
                      onClick={() => setSeeNewPassword(prev => !prev)}
                    />
                  ) : (
                    <IoEyeOutline
                      className="absolute top-[25%] right-3 cursor-pointer"
                      size="1.5em"
                      onClick={() => setSeeNewPassword(prev => !prev)}
                    />
                  )}
                </div>
              </span>
              <span className="flex flex-col">
                <label>Confirmar la contraseña</label>
                <div className="relative max-w-[400px]">
                  <input
                    type={seeConfirmPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    maxLength={25}
                    {...register("confirmPassword", {
                      required: "Se requiere que confirme la contraseña",
                      validate: (value) =>
                        value === getValues("newPassword") ||
                        "Las contraseñas no coinciden",
                    })}
                    className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  />
                  {seeConfirmPassword ? (
                    <IoEyeOffOutline
                      className="absolute top-[25%] right-3 cursor-pointer"
                      size="1.5em"
                      onClick={() => setSeeConfirmPassword(prev => !prev)}
                    />
                  ) : (
                    <IoEyeOutline
                      className="absolute top-[25%] right-3 cursor-pointer"
                      size="1.5em"
                      onClick={() => setSeeConfirmPassword(prev => !prev)}
                    />
                  )}
                </div>
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
        <AnimatePresence>
        {showDialog && (
          <Dialog
            title="Actualizando contraseña"
            textAccept="Actualizando"
            message=""
            showLoading={showLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Perfile;
