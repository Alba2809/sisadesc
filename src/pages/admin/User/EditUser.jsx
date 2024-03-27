import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { formatDateShort, formatDateTime } from "../../../constants/functions";
import { useRole } from "../../../hooks/useRole";
import { useUser } from "../../../hooks/useUser";
import { useAddress } from "../../../hooks/useAddress";
import InputSelect from "../../../components/InputSelect";
import AlertMessage from "../../../components/AlertMessage";
import UploadImagePerfile from "../../../components/UploadImagePerfile";

function EditUser() {
  const params = useParams();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { roles, handleChangeRole } = useRole({ setValue });
  const {
    getUser,
    updateUser,
    loading,
    user,
    errors: updateErrors,
  } = useUser();
  const { handleChangeCP, handleSelectAddress, suggestions } = useAddress({
    setValue,
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      await getUser(params.id, setValue);
    }
    getData();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append("firstname", data.firstname);
      formData.append("lastnamepaternal", data.lastnamepaternal);
      formData.append("lastnamematernal", data.lastnamematernal);
      formData.append("curp", data.curp);
      formData.append("rfc", data.rfc);
      formData.append("addressid", +data.addressid);
      formData.append("street", data.street);
      formData.append("phonenumber", data.phonenumber);
      formData.append("birthdate", data.birthdate);
      formData.append("status", data.status);
      formData.append("email", data.email);
      formData.append("role", +data.role);
      formData.append("imageperfile", data.imageperfile);
      const res = await updateUser(user.id, formData);
      if (res?.statusText === "OK") navigate("/admin/users");
    } catch (error) {}
  });

  const dateInputRef = useRef(null);

  const handleChange = (e) => {
    const date = e.target.value;
    setValue("birthdate", date.toString());
  };

  const handleChangeStatus = (value) => {
    setValue("status", value);
  };

  const handleFileChange = (file) => {
    setValue("imageperfile", file);
  };

  const handleInputNumber = (e) => {
    const { value } = e.target;

    const regex = /^\d*$/;
    if (regex.test(value)) {
      setValue("phonenumber", value);
    } else {
      e.target.value = e.target.value.replace(/\D/g, "");
    }
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
                {suggestions.length > 0 && (
                  <ul className="absolute z-50 left-0 mt-1 p-2 bg-white border rounded-md shadow-md">
                    {suggestions.map((address) => (
                      <li
                        key={address.id}
                        onClick={() => handleSelectAddress(address)}
                        className="cursor-pointer hover:bg-blue-100 p-1 rounded-md"
                      >
                        {`${address.CP} - ${address.asentamiento}`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Colonia<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("colony", {
                    required: "Se requiere la colonia",
                  })}
                  className="w-full text-gray-500 px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  disabled
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
                  Teléfono<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
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
                  onChange={handleInputNumber}
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
                  defaultValue={formatDateShort(user.birthdate)}
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
                  defaultValue={
                    roles.find((rol) => rol.id === user.role.id).name ?? ""
                  }
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
    </div>
  );
}

export default EditUser;
