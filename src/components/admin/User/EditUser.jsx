import { useAdmin } from "@context/AdminContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { formatDateShort, formatDateTime } from "@constants/functions";
import InputSelect from "@components/InputSelect";
import Dialog from "@components/Dialog";
import AlertMessage from "@components/AlertMessage";
import UploadImagePerfile from "@components/UploadImagePerfile";

function EditUser() {
  const params = useParams();
  const {
    getOneSomething,
    getAllSomething,
    updateSomething,
    errors: updateErrors,
  } = useAdmin();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showLoading, setShowLoading] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      const userData = await getOneSomething(params.id, "user");
      const rolesData = await getAllSomething("role");
      setUser(userData);
      setValue("firstname", userData.firstname);
      setValue("lastnamepaternal", userData.lastnamepaternal);
      setValue("lastnamematernal", userData.lastnamematernal);
      setValue("curp", userData.curp);
      setValue("rfc", userData.rfc);
      setValue("email", userData.email);
      setValue("street", userData.direction.street);
      setValue("colony", userData.direction.colony);
      setValue("postalcode", userData.direction.postalcode);
      setValue("phonenumber", userData.phonenumber);
      setValue("birthdate", formatDateShort(userData.birthdate ?? new Date()));
      setValue("status", userData.status);
      setValue("role", userData.role);
      setValue("imageperfile", userData.imageperfile);
      setRoles(rolesData);
      setLoading(false);
    }
    getUser();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      handleDialog();
      const formData = new FormData();
      formData.append("firstname", data.firstname);
      formData.append("lastnamepaternal", data.lastnamepaternal);
      formData.append("lastnamematernal", data.lastnamematernal);
      formData.append("curp", data.curp);
      formData.append("rfc", data.rfc);
      formData.append("email", data.email);
      formData.append("street", data.street);
      formData.append("colony", data.colony);
      formData.append("postalcode", data.postalcode);
      formData.append("phonenumber", data.phonenumber);
      formData.append("birthdate", data.birthdate);
      formData.append("status", data.status);
      formData.append("role", data.role);
      formData.append("imageperfile", data.imageperfile);
      const res = await updateSomething(user._id, formData, "user");
      handleDialog();
      if(res?.statusText === "OK") navigate("/admin/users")
    } catch (error) {
      handleDialog();
      console.log(error);
    }
  });

  const handleDialog = () => {
    setShowLoading((prev) => (prev === "" ? "true" : ""));
    setShowDialog((prev) => !prev);
  };

  const dateInputRef = useRef(null);

  const handleChange = (e) => {
    setValue("birthdate", e.target.value);
  };

  const handleChangeStatus = (value) => {
    setValue("status", value);
  };

  const handleChangeRole = (value) => {
    const rol = roles.find((role) => role.name === value);
    if (rol) return setValue("role", rol._id);
    setValue("role", null);
  };

  const handleFileChange = (file) => {
    setValue("imageperfile", file);
  };

  const handleChangeCP = (e) => {
    const postalcode = e.target.value.replace(/[^0-9]/g, "");
    setValue("postalcode", postalcode);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Editar usuario</h1>
      </header>
      <section className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
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
                  RFC<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={13}
                  {...register("rfc", {
                    required: "Se requiere el RFC",
                    maxLength: {
                      value: 13,
                      message: "El RFC no debe exceder los 13 caracteres",
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
                      message:
                        "El código postal no debe exceder los 5 caracteres",
                    },
                    min: {
                      value: 1,
                      message: "Código postal inválido",
                    },
                  })}
                  className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  onChange={handleChangeCP}
                  min={0}
                />
              </div>
              <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Teléfono<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  maxLength={10}
                  minLength={10}
                  {...register("phonenumber", {
                    required: "Se requiere el teléfono",
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
                  onChange={handleChange}
                  ref={dateInputRef}
                  className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  defaultValue={formatDateShort(user.birthdate ?? new Date())}
                />
              </div>
              <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Estatus<span className="text-red-500">*</span>
                </label>
                <InputSelect
                  options={["Activo", "Inactivo"]}
                  onOptionChange={handleChangeStatus}
                  defaultValue={user.status}
                  style="px-4 py-3 border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                />
              </div>
              <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Rol<span className="text-red-500">*</span>
                </label>
                <InputSelect
                  options={roles.map((rol) => rol.name)}
                  onOptionChange={handleChangeRole}
                  defaultValue={roles.find((rol) => rol._id === user.role).name}
                  style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                />
              </div>
              <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[100%] md:min-w-[100%] ">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Perfil<span className="text-red-500">*</span>
                </label>
                <Controller
                  name="imageperfile"
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <UploadImagePerfile
                      {...field}
                      onFileChange={handleFileChange}
                      user={user}
                    />
                  )}
                />
              </div>
              <div className="relative flex-1 min-w-[30%]">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Última actualización<span className="text-red-500">*</span>
                </label>
                <p className="w-full text-black px-4 py-3 rounded-md border bg-[#e8ecef]">
                  {formatDateTime(user.updatedAt)}
                </p>
              </div>
              <section className="w-full">
                <button
                  type="submit"
                  className="py-2 px-8 bg-blue-600 hover:bg-[#18aefa] text-white text-lg rounded-lg"
                >
                  Actualizar
                </button>
              </section>
            </form>
          </>
        )}
      </section>
      <AnimatePresence>
        {showDialog && (
          <Dialog
            title="Realizando cambios"
            textAccept="Actualizar"
            message="¿Está seguro de eliminar el usuario?"
            showLoading={showLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default EditUser;
