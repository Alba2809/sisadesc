import { useAdmin } from "@context/AdminContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { formatDateShort, scrollToTop } from "@constants/functions";
import { genders, grades, groups } from "@constants/constants";
import InputSelect from "@components/InputSelect";
import Dialog from "@components/Dialog";
import AlertMessage from "@components/AlertMessage";

function EditStudent() {
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
  const [studentSuggestions, setStudentSuggestions] = useState([]);
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
      const objectData = await getOneSomething(params.id, "student");
      const addressesData = await getAllSomething("address");
      setAddresses(addressesData);
      setObject(objectData);
      setValue("student_firstname", objectData.firstname);
      setValue("student_lastnamepaternal", objectData.lastnamepaternal);
      setValue("student_lastnamematernal", objectData.lastnamematernal);
      setValue("student_curp", objectData.curp);
      setValue("student_gender", objectData.gender);
      setValue("student_birthdate", formatDateShort(objectData.birthdate));
      setValue("student_street", objectData.address.street);
      setValue("student_colony", objectData.address.settlement);
      setValue("student_addressid", objectData.address.id);
      setValue("student_postalcode", objectData.address.postalcode);
      setValue("student_group", objectData.group);
      setValue("student_grade", objectData.grade?.toString());
      setValue("student_phonenumber", objectData.phonenumber);
      setValue("student_email", objectData.email);
      setValue("father_curp", objectData.father_curp);
      setValue("mother_curp", objectData.mother_curp);
      setValue("tutor_curp", objectData.tutor_curp);
      setLoading(false);
    }
    if (loading) getObject();
  }, [loading]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      handleDialog();
      const res = await updateSomething(object.id, data, "student");
      if (res?.statusText === "OK") navigate("/admin/students");
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

  const handleChangeInput = (e, name, type, person) => {
    let value = null;
    if (type === "number") value = e.target.value.replace(/[^0-9]/g, "");
    setValue(name, value ?? e.target.value);
    if (name.includes("postalcode")) {
      if (value.length === 5) {
        const matchingAddresses = addresses.filter((address) =>
          address.CP.includes(value)
        );
        if (person === "student") setStudentSuggestions(matchingAddresses);
      }
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setValue("student_colony", address.asentamiento);
    setValue("student_postalcode", address.CP);
    setValue("student_addressid", address.id);
    setStudentSuggestions([]);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Editar estudiante</h1>
      </header>
      <section
        id="container"
        className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto"
      >
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
                  Datos del estudiante
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
                    {...register("student_firstname", {
                      required: "Se requiere el nombre del estudiante",
                      maxLength: {
                        value: 20,
                        message:
                          "El nombre del estudiante no debe exceder los 20 caracteres",
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
                    {...register("student_lastnamepaternal", {
                      required: "Se requiere el primer apellido del estudiante",
                      maxLength: {
                        value: 20,
                        message:
                          "El primer apellido del estudiante no debe exceder los 20 caracteres",
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
                    {...register("student_lastnamematernal", {
                      required:
                        "Se requiere el segundo apellido del estudiante",
                      maxLength: {
                        value: 20,
                        message:
                          "El segundo apellido del estudiante no debe exceder los 20 caracteres",
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
                    {...register("student_curp", {
                      required: "Se requiere el CURP del estudiante",
                      maxLength: {
                        value: 18,
                        message:
                          "La CURP del estudiante no debe exceder los 18 caracteres",
                      },
                      pattern: {
                        value: /^[A-ZÑ]{4}[0-9]{6}[A-ZÑ]{6,7}[0-9]{1,2}$/,
                        message:
                          "CURP del estudiante es inválido. Verifique el formato y que las letras sean mayúsculas.",
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
                    onOptionChange={handleChangeSelect}
                    object="student_gender"
                    style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  />
                </div>
                <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                  <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                    Fecha de nacimiento<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("student_birthdate", {
                      required:
                        "Se requiere la fecha de nacimiento del estudiante",
                    })}
                    onChange={(e) => handleChangeInput(e, "student_birthdate")}
                    ref={dateInputRef}
                    className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    defaultValue={formatDateShort(object.birthdate)}
                  />
                </div>
                <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                  <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    maxLength={30}
                    {...register("student_email", {
                      required: "Se requiere el email del estudiante",
                      maxLength: {
                        value: 30,
                        message:
                          "El email del estudiante no debe exceder los 30 caracteres",
                      },
                    })}
                    className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  />
                </div>
                <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                  <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                    Grado<span className="text-red-500">*</span>
                  </label>
                  <InputSelect
                    options={grades}
                    onOptionChange={handleChangeSelect}
                    object="student_grade"
                    style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    defaultValue={object.grade}
                  />
                </div>
                <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                  <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                    Grupo<span className="text-red-500">*</span>
                  </label>
                  <InputSelect
                    options={groups}
                    onOptionChange={handleChangeSelect}
                    object="student_group"
                    style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    defaultValue={object.group}
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
                    {...register("student_phonenumber", {
                      required: "Se requiere el código postal del estudiante",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Solo se permiten números del estudiante",
                      },
                      maxLength: {
                        value: 10,
                        message:
                          "El teléfono del estudiante debe tener 10 números",
                      },
                      minLength: {
                        value: 10,
                        message:
                          "El teléfono del estudiante debe tener 10 números",
                      },
                    })}
                    className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    onChange={(e) =>
                      handleChangeInput(e, "student_phonenumber", "number")
                    }
                    min={0}
                  />
                </div>
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
                    {...register("student_postalcode", {
                      required: "Se requiere el código postal del estudiante",
                      pattern: {
                        value: /^[0-9]+$/,
                        message:
                          "Solo se permiten números en el código postal del estudiante",
                      },
                      maxLength: {
                        value: 5,
                        message:
                          "El código postal del estudiante no debe exceder los 5 caracteres",
                      },
                      min: {
                        value: 1,
                        message: "Código postal del estudiante es inválido",
                      },
                    })}
                    className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    onChange={(e) =>
                      handleChangeInput(
                        e,
                        "student_postalcode",
                        "number",
                        "student"
                      )
                    }
                    min={0}
                  />
                  {studentSuggestions.length > 0 && (
                    <ul className="absolute z-50 left-0 mt-1 p-2 bg-white border rounded-md shadow-md">
                      {studentSuggestions.map((address) => (
                        <li
                          key={address.id}
                          onClick={() =>
                            handleSelectAddress(address, "student")
                          }
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
                    {...register("student_colony", {
                      required: "Se requiere la colonia del estudiante",
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
                    {...register("student_street", {
                      required: "Se requiere la calle del estudiante",
                      maxLength: {
                        value: 30,
                        message:
                          "La calle del estudiante no debe exceder los 30 caracteres",
                      },
                    })}
                    className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  />
                </div>
                <h2 className="w-full font-medium font-serif text-xl">
                  Padres/Tutor
                </h2>
                <p className="w-full font-serif text-lg">
                  En caso de que el tutor sea uno de los padres, escriba la CURP
                  del padre.
                </p>
                <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                  <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                    CURP del padre
                  </label>
                  <input
                    type="text"
                    maxLength={18}
                    {...register("father_curp", {
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
                    CURP de la madre
                  </label>
                  <input
                    type="text"
                    maxLength={18}
                    {...register("mother_curp", {
                      maxLength: {
                        value: 18,
                        message:
                          "La CURP de la madre no debe exceder los 18 caracteres",
                      },
                      pattern: {
                        value: /^[A-ZÑ]{4}[0-9]{6}[A-ZÑ]{6,7}[0-9]{1,2}$/,
                        message:
                          "CURP de la madre es inválido. Verifique el formato y que las letras sean mayúsculas.",
                      },
                    })}
                    className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                  />
                </div>
                <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                  <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                    CURP del tutor
                  </label>
                  <input
                    type="text"
                    maxLength={18}
                    {...register("tutor_curp", {
                      maxLength: {
                        value: 18,
                        message:
                          "La CURP del tutor no debe exceder los 18 caracteres",
                      },
                      pattern: {
                        value: /^[A-ZÑ]{4}[0-9]{6}[A-ZÑ]{6,7}[0-9]{1,2}$/,
                        message:
                          "CURP del tutor es inválido. Verifique el formato y que las letras sean mayúsculas.",
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

export default EditStudent;
