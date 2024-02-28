import { useAdmin } from "@context/AdminContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { genders, vitalStatus } from "@constants/constants";
import { scrollToTop } from "@constants/functions";
import InputSelect from "@components/InputSelect";
import Dialog from "@components/Dialog";
import AlertMessage from "@components/AlertMessage";

function RegisterParent() {
  const {
    getAllSomething,
    registerSomething,
    errors: registerErrors,
  } = useAdmin();
  const dateInputRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showLoading, setShowLoading] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      const addressesData = await getAllSomething("address");
      setAddresses(addressesData);
    }
    setValue("gender", genders[0]);
    setValue("status", vitalStatus[0]);
    getData();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      handleDialog();

      /* delete all data equal to "" or null */
      for (const key in data) {
        if (data[key] === "" || data[key] === null) delete data[key];
      }

      const res = await registerSomething(data, "parent");

      if (res?.statusText === "OK") {
        navigate("/admin/parents");
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

  const handleChangeSelect = (value, name) => {
    setValue(name, value);
  };

  const handleChangeInput = (e, name, type) => {
    let value = null;
    if (type === "number") value = e.target.value.replace(/[^0-9]/g, "");
    setValue(name, value ?? e.target.value);
    if (name.includes("postalcode")) {
      if (value.length === 5) {
        const matchingAddresses = addresses.filter((address) =>
          address.CP.includes(value)
        );

        setSuggestions(matchingAddresses);
      }
    }
  };

  const handleSelectAddress = (address) => {
    setValue("colony", address.asentamiento);
    setValue("postalcode", address.CP);
    setValue("addressid", address.id);
    setSuggestions([]);
  };

  useEffect(() => {
    if (errors.length > 0) scrollToTop();
  }, [errors]);

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Registrar padre</h1>
      </header>
      <section
        id="container"
        className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto"
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
                required: "Se requiere el nombre del padre",
                maxLength: {
                  value: 20,
                  message:
                    "El nombre del padre no debe exceder los 20 caracteres",
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
                required: "Se requiere el primer apellido del padre",
                maxLength: {
                  value: 20,
                  message:
                    "El primer apellido del padre no debe exceder los 20 caracteres",
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
                required: "Se requiere el segundo apellido del padre",
                maxLength: {
                  value: 20,
                  message:
                    "El segundo apellido del padre no debe exceder los 20 caracteres",
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
                required: "Se requiere la CURP del padre",
                maxLength: {
                  value: 18,
                  message:
                    "La CURP del padre no debe exceder los 18 caracteres",
                },
                pattern: {
                  value: /^[A-ZÑ]{4}[0-9]{6}[A-ZÑ]{6,7}[0-9]{1,2}$/,
                  message:
                    "CURP del padre es inválido. Verifique el formato y que las letras sean mayúsculas.",
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
                  message: "El RFC del padre no debe exceder los 13 caracteres",
                },
                pattern: {
                  value: /^[A-ZÑ]{4}[0-9]{6}[A-ZÑ0-9]{0,}$/,
                  message:
                    "RFC del padre es inválido. Verifique el formato y que las letras sean mayúsculas.",
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
                required: "Se requiere la fecha de nacimiento del padre",
              })}
              onChange={(e) => handleChangeInput(e, "birthdate")}
              ref={dateInputRef}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Género<span className="text-red-500">*</span>
            </label>
            <InputSelect
              options={genders}
              onOptionChange={handleChangeSelect}
              object="gender"
              style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Teléfono
            </label>
            <input
              type="text"
              maxLength={10}
              minLength={10}
              {...register("phonenumber", {
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Solo se permiten números en el teléfono del padre",
                },
                maxLength: {
                  value: 10,
                  message: "El teléfono del padre debe tener 10 números",
                },
                minLength: {
                  value: 10,
                  message: "El teléfono del padre debe tener 10 números",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
              onChange={(e) => handleChangeInput(e, "phonenumber", "number")}
              min={0}
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Estado vital<span className="text-red-500">*</span>
            </label>
            <InputSelect
              options={vitalStatus}
              onOptionChange={handleChangeSelect}
              object="status"
              style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Email
            </label>
            <input
              type="email"
              maxLength={30}
              {...register("email", {
                maxLength: {
                  value: 30,
                  message:
                    "El email del padre no debe exceder los 30 caracteres",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <h2 className="w-full font-medium font-serif text-xl">Dirección</h2>
          <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Código postal<span className="text-red-500">*</span>
            </label>
            <input
              autoComplete="off"
              type="text"
              maxLength={5}
              {...register("postalcode", {
                required: "Se requiere el código postal del padre",
                pattern: {
                  value: /^[0-9]+$/,
                  message:
                    "Solo se permiten números en el código postal del padre",
                },
                maxLength: {
                  value: 5,
                  message:
                    "El código postal del padre no debe exceder los 5 caracteres",
                },
                min: {
                  value: 1,
                  message: "Código postal del padre es inválido",
                },
              })}
              className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
              onChange={(e) => handleChangeInput(e, "postalcode", "number")}
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
                required: "Se requiere la colonia del padre",
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
                required: "Se requiere la calle del padre",
                maxLength: {
                  value: 30,
                  message:
                    "La calle del padre no debe exceder los 30 caracteres",
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

export default RegisterParent;
