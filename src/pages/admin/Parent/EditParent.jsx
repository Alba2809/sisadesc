import { useAdmin } from "@context/AdminContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { formatDateShort, scrollToTop } from "@constants/functions";
import { genders, vitalStatus, expCurp, expRfc, typesParents } from "@constants/constants";
import InputSelect from "@components/InputSelect";
import Dialog from "@components/Dialog";
import AlertMessage from "@components/AlertMessage";

function EditParent() {
    const params = useParams();
    const {
      getOneSomething,
      getAllSomething,
      updateSomething,
      errors: updateErrors,
    } = useAdmin();
    const [object, setObject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showLoading, setShowLoading] = useState("");
    const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm();
    const navigate = useNavigate();
  
    useEffect(() => {
      async function getObject() {
        const objectData = await getOneSomething(params.id, "parent");
        const addressesData = await getAllSomething("address");
        setAddresses(addressesData);
        setObject(objectData);
        setValue("firstname", objectData.firstname);
        setValue("lastnamepaternal", objectData.lastnamepaternal);
        setValue("lastnamematernal", objectData.lastnamematernal);
        setValue("curp", objectData.curp);
        setValue("rfc", objectData.rfc);
        setValue("birthdate", formatDateShort(objectData.birthdate));
        setValue("email", objectData.email);
        setValue("phonenumber", objectData.phonenumber);
        setValue("colony", objectData.address.settlement);
        setValue("street", objectData.address.street);
        setValue("postalcode", objectData.address.postalcode);
        setValue("addressid", objectData.address.id);
        setValue("status", objectData.status);
        setValue("gender", objectData.gender);
        setValue("type", objectData.type);
        setLoading(false);
      }
      if (loading) getObject();
    }, [loading]);
  
    const onSubmit = handleSubmit(async (data) => {
      try {
        handleDialog();
        for (const key in data) {
            if (data[key] === "" || data[key] === null) {
              delete data[key];
            }
          }
        const res = await updateSomething(object.id, data, "parent");
        if (res?.statusText === "OK") navigate("/admin/parents");
        else scrollToTop();
        handleDialog();
      } catch (error) {
        handleDialog();
      }
    });
  
    const handleDialog = () => {
      setShowLoading((prev) => (prev === "" ? "true" : ""));
      setShowDialog((prev) => !prev);
    };
  
    const dateInputRef = useRef(null);
  
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
      setSelectedAddress(address);
      setValue("colony", address.asentamiento);
      setValue("postalcode", address.CP);
      setValue("addressid", address.id);
      setSuggestions([]);
    };
  
    return (
      <div className="w-full h-full flex flex-col">
        <header className="h-[50px]">
          <h1 className="font-medium font-serif text-2xl">Editar padre/tutor</h1>
        </header>
        <section id="container" className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto">
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
                <>
                <h2 className="w-full font-medium font-serif text-2xl">
                  Datos del padre/tutor
                </h2>
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
                        message:
                          "El nombre no debe exceder los 20 caracteres",
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
                      required: "Se requiere la CURP",
                      maxLength: {
                        value: 18,
                        message:
                          "La CURP no debe exceder los 18 caracteres",
                      },
                      pattern: {
                        value: expCurp,
                        message:
                          "CURP es inválido. Verifique el formato y que las letras sean mayúsculas.",
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
                        message:
                          "El RFC no debe exceder los 13 caracteres",
                      },
                      pattern: {
                        value: expRfc,
                        message:
                          "RFC es inválido. Verifique el formato y que las letras sean mayúsculas.",
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
                    onChange={(e) => handleChangeInput(e, "birthdate")}
                    ref={dateInputRef}
                    className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    defaultValue={formatDateShort(object.birthdate)}
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
                        message:
                          "Solo se permiten números en el teléfono",
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
                    onChange={(e) =>
                      handleChangeInput(e, "phonenumber", "number")
                    }
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
                          "El email no debe exceder los 30 caracteres",
                      },
                    })}
                    className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  />
                </div>
                {/* <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                  <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                    Tipo de registro<span className="text-red-500">*</span>
                  </label>
                  <InputSelect
                    options={typesParents}
                    onOptionChange={handleChangeSelect}
                    object="type"
                    style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  />
                </div> */}
                <h2 className="w-full font-medium font-serif text-xl">
                  Dirección
                </h2>
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
                        message:
                          "Solo se permiten números en el código postal",
                      },
                      maxLength: {
                        value: 5,
                        message:
                          "El código postal no debe exceder los 5 caracteres",
                      },
                      min: {
                        value: 1,
                        message: "Código postal es inválido",
                      },
                    })}
                    className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    onChange={(e) =>
                      handleChangeInput(
                        e,
                        "postalcode",
                        "number"
                      )
                    }
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
                        message:
                          "La calle no debe exceder los 30 caracteres",
                      },
                    })}
                    className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  />
                </div>
              </>
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
              showLoading={showLoading}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

export default EditParent