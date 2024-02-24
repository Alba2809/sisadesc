import { useAdmin } from "@context/AdminContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { genders, vitalStatus, grades, groups } from "@constants/constants";
import { scrollToTop } from "@constants/functions";
import { FaCheck } from "react-icons/fa";
import InputSelect from "@components/InputSelect";
import Dialog from "@components/Dialog";
import AlertMessage from "@components/AlertMessage";

function RegisterStudent() {
  const {
    registerSomething,
    getAllSomething,
    deleteSomething,
    errors: registerErrors,
  } = useAdmin();
  const dateInputRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showLoading, setShowLoading] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [fatherSuggestions, setFatherSuggestions] = useState([]);
  const [motherSuggestions, setMotherSuggestions] = useState([]);
  const [tutorSuggestions, setTutorSuggestions] = useState([]);
  const [showFormNewParent, setShowFormNewParent] = useState(null);
  const [showFormFather, setShowFormFather] = useState(false);
  const [showFormMother, setShowFormMother] = useState(false);
  const [showFormTutor, setShowFormTutor] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    unregister,
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      const addressesData = await getAllSomething("address");
      setAddresses(addressesData);
    }
    setValue("student_gender", genders[0]);
    setValue("student_grade", grades[0]);
    setValue("student_group", groups[0]);
    setValue("father_gender", genders[0]);
    setValue("mother_gender", genders[1]);
    setValue("tutor_gender", genders[0]);
    setValue("father_status", vitalStatus[0]);
    setValue("mother_status", vitalStatus[0]);
    setValue("tutor_status", vitalStatus[0]);
    setValue("isTutor", "Madre");
    getData();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      handleDialog();

      let totalQueries = 0;
      let queriesRealized = [];
      console.log("Antes del delete", data);
      for (const key in data) {
        if (data[key] === "" || data[key] === null) {
          delete data[key];
        }
      }
      console.log("Despues del delete", data);
      if (showFormNewParent === "No") {
        if (showFormFather) {
          totalQueries++;
          const resFather = await registerSomething(data, "father");
          if (resFather?.statusText === "OK") {
            queriesRealized.push(resFather);
            data.father_firstname = null;
          } else scrollToTop();
        }
        if (showFormMother) {
          totalQueries++;
          const resMother = await registerSomething(data, "mother");
          if (resMother?.statusText === "OK") {
            queriesRealized.push(resMother);
            data.mother_firstname = null;
          } else scrollToTop();
        }
        if (showFormTutor) {
          totalQueries++;
          const resTutor = await registerSomething(data, "tutor");
          if (resTutor?.statusText === "OK") {
            queriesRealized.push(resTutor);
            data.tutor_firstname = null;
          } else scrollToTop();
        }
      }

      if (queriesRealized.length !== totalQueries) {
        queriesRealized.map(async (query) => {
          console.log(query);
          await deleteSomething(query.data, "parent");
        });
        handleDialog();
        return;
      }
      const res = await registerSomething(data, "student");
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

  const handleChangeSelect = (value, name) => setValue(name, value);

  const handleChangeInput = (e, name, type, person) => {
    let value = null;
    if (type === "number") value = e.target.value.replace(/[^0-9]/g, "");
    setValue(name, value ?? e.target.value);
    if (name.includes("postalcode")) {
      if (value.length === 5) {
        const matchingAddresses = addresses.filter((address) =>
          address.CP.includes(value)
        );

        if (person === "father") setFatherSuggestions(matchingAddresses);
        if (person === "mother") setMotherSuggestions(matchingAddresses);
        if (person === "tutor") setTutorSuggestions(matchingAddresses);
        if (person === "student") setStudentSuggestions(matchingAddresses);
      }
    }
  };

  const handleSelectAddress = (address, type) => {
    if (type === "father") {
      setValue("father_colony", address.asentamiento);
      setValue("father_postalcode", address.CP);
      setValue("father_addressid", address.id);
      setFatherSuggestions([]);
    }
    if (type === "mother") {
      setValue("mother_colony", address.asentamiento);
      setValue("mother_postalcode", address.CP);
      setValue("mother_addressid", address.id);
      setMotherSuggestions([]);
    }
    if (type === "tutor") {
      setValue("tutor_colony", address.asentamiento);
      setValue("tutor_postalcode", address.CP);
      setValue("tutor_addressid", address.id);
      setTutorSuggestions([]);
    }
    if (type === "student") {
      setValue("student_colony", address.asentamiento);
      setValue("student_postalcode", address.CP);
      setValue("student_addressid", address.id);
      setStudentSuggestions([]);
    }
  };

  const handleClickRegister = (e) => {
    if (showFormNewParent !== e.target.value) {
      setShowFormNewParent(e.target.value);
      if (e.target.value === "Yes") {
        setShowFormFather(false);
        setShowFormMother(false);
        setShowFormTutor(false);
      }
    }
  };

  const handleShowForm = (type) => {
    if (type === "father") {
      setShowFormFather((prev) => !prev);
    }
    if (type === "mother") {
      setShowFormMother((prev) => !prev);
    }
    if (type === "tutor") {
      setShowFormTutor((prev) => !prev);
    }
  };

  useEffect(() => {
    if (!showFormFather) {
      unregister([
        "father_firstname",
        "father_lastnamepaternal",
        "father_lastnamematernal",
        "father_curp",
        "father_rfc",
        "father_birthdate",
        "father_email",
        "father_phonenumber",
        "father_colony",
        "father_postalcode",
        "father_addressid",
        "father_status",
        "father_street",
      ]);
    }
    if (!showFormMother) {
      unregister([
        "mother_firstname",
        "mother_lastnamepaternal",
        "mother_lastnamematernal",
        "mother_curp",
        "mother_rfc",
        "mother_birthdate",
        "mother_email",
        "mother_phonenumber",
        "mother_colony",
        "mother_postalcode",
        "mother_addressid",
        "mother_status",
        "mother_street",
      ]);
    }
    if (!showFormTutor) {
      unregister([
        "tutor_firstname",
        "tutor_lastnamepaternal",
        "tutor_lastnamematernal",
        "tutor_curp",
        "tutor_rfc",
        "tutor_birthdate",
        "tutor_email",
        "tutor_phonenumber",
        "tutor_colony",
        "tutor_postalcode",
        "tutor_addressid",
        "tutor_status",
        "tutor_street",
      ]);
    }
    if (showFormFather && !showFormMother && !showFormTutor)
      setValue("isTutor", "Padre");
    else if (showFormMother && !showFormFather && !showFormTutor)
      setValue("isTutor", "Madre");
    else if(showFormFather && showFormMother && !showFormTutor)
      setValue("isTutor", "Madre");
    else if (!showFormTutor && !showFormFather && !showFormMother)
      unregister(["isTutor"]);
  }, [showFormFather, showFormMother, showFormTutor]);

  useEffect(() => {
    if (errors.length > 0) scrollToTop();
  }, [errors]);

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Agregar estudiante</h1>
      </header>
      <section
        id="container"
        className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto"
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
          {/* Formulario del estudiante */}
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
                  required: "Se requiere el segundo apellido del estudiante",
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
                  required: "Se requiere la fecha de nacimiento del estudiante",
                })}
                onChange={(e) => handleChangeInput(e, "student_birthdate")}
                ref={dateInputRef}
                className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
              />
            </div>
            <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
              <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                Email
              </label>
              <input
                type="email"
                maxLength={30}
                {...register("student_email", {
                  required: false,
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
                {...register("student_phonenumber", {
                  required: false,
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Solo se permiten números del estudiante",
                  },
                  maxLength: {
                    value: 10,
                    message: "El teléfono del estudiante debe tener 10 números",
                  },
                  minLength: {
                    value: 10,
                    message: "El teléfono del estudiante debe tener 10 números",
                  },
                })}
                className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                onChange={(e) =>
                  handleChangeInput(e, "student_phonenumber", "number")
                }
                min={0}
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
                      onClick={() => handleSelectAddress(address, "student")}
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
          </>
          <section className="w-full">
            <span className="w-full font-medium font-serif text-lg">
              ¿Ya fueron registrados los padres/tutor?
            </span>
            <div className="mt-2 flex flex-wrap gap-5 gap-y-0">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  className=""
                  name="accountType"
                  value="Yes"
                  onClick={handleClickRegister}
                />
                <span className="font-normal font-serif text-base">
                  Si, buscar a los padres/tutor existentes
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  className=""
                  name="accountType"
                  value="No"
                  onClick={handleClickRegister}
                />
                <span className="font-normal font-serif text-base">
                  No, registrar nuevos padres/tutor
                </span>
              </label>
            </div>
          </section>
          {showFormNewParent === "No" && (
            <>
              <section>
                <p className="w-full font-medium font-serif text-lg">
                  Seleccione los padres/tutor a registrar (Solo en caso de que
                  el tutor sea diferente a los padres seleccionelo)
                </p>
                <div className="flex flex-col items-start">
                  <button
                    onClick={() => handleShowForm("father")}
                    type="button"
                    className="flex flex-row gap-2 items-center"
                  >
                    <div
                      className={`min-w-4 min-h-4 max-h-4 max-w-4 border border-gray-600 rounded-[5px] flex items-center justify-center ${
                        showFormFather ? "bg-blue-600" : "bg-white"
                      }`}
                    >
                      <FaCheck color="white" size="0.6em" />
                    </div>
                    <label className="inline-flex items-center">Padre</label>
                  </button>
                  <button
                    onClick={() => handleShowForm("mother")}
                    type="button"
                    className="flex flex-row gap-2 items-center"
                  >
                    <div
                      className={`min-w-4 min-h-4 max-h-4 max-w-4 border border-gray-600 rounded-[5px] flex items-center justify-center ${
                        showFormMother ? "bg-blue-600" : "bg-white"
                      }`}
                    >
                      <FaCheck color="white" size="0.6em" />
                    </div>
                    <label className="inline-flex items-center">Madre</label>
                  </button>
                  <button
                    onClick={() => handleShowForm("tutor")}
                    type="button"
                    className="flex flex-row gap-2 items-center"
                  >
                    <div
                      className={`min-w-4 min-h-4 max-h-4 max-w-4 border border-gray-600 rounded-[5px] flex items-center justify-center ${
                        showFormTutor ? "bg-blue-600" : "bg-white"
                      }`}
                    >
                      <FaCheck color="white" size="0.6em" />
                    </div>
                    <label className="inline-flex items-center">Tutor</label>
                  </button>
                </div>
              </section>
              {/* Formulario del padre */}
              {showFormFather && (
                <>
                  <h2 className="w-full font-medium font-serif text-2xl">
                    Datos del padre
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
                      {...register("father_firstname", {
                        required:
                          showFormFather && showFormNewParent === "No"
                            ? "Se requiere el nombre del padre"
                            : false,
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
                      {...register("father_lastnamepaternal", {
                        required:
                          showFormFather && showFormNewParent === "No"
                            ? "Se requiere el primer apellido del padre"
                            : false,
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
                      {...register("father_lastnamematernal", {
                        required:
                          showFormFather && showFormNewParent === "No"
                            ? "Se requiere el segundo apellido del padre"
                            : false,
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
                      {...register("father_curp", {
                        required:
                          showFormFather && showFormNewParent === "No"
                            ? "Se requiere la CURP del padre"
                            : false,
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
                      {...register("father_rfc", {
                        maxLength: {
                          value: 13,
                          message:
                            "El RFC del padre no debe exceder los 13 caracteres",
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
                      {...register("father_birthdate", {
                        required:
                          showFormFather && showFormNewParent === "No"
                            ? "Se requiere la fecha de nacimiento del padre"
                            : false,
                      })}
                      onChange={(e) => handleChangeInput(e, "father_birthdate")}
                      ref={dateInputRef}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    />
                  </div>
                  <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                    <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                      Email
                    </label>
                    <input
                      type="email"
                      maxLength={30}
                      {...register("father_email", {
                        maxLength: {
                          value: 30,
                          message:
                            "El email del padre no debe exceder los 30 caracteres",
                        },
                      })}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
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
                      {...register("father_phonenumber", {
                        pattern: {
                          value: /^[0-9]+$/,
                          message:
                            "Solo se permiten números el teléfono del padre",
                        },
                        maxLength: {
                          value: 10,
                          message:
                            "El teléfono del padre debe tener 10 números",
                        },
                        minLength: {
                          value: 10,
                          message:
                            "El teléfono del padre debe tener 10 números",
                        },
                      })}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                      onChange={(e) =>
                        handleChangeInput(e, "father_phonenumber", "number")
                      }
                      min={0}
                    />
                  </div>
                  <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                    <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                      Estado<span className="text-red-500">*</span>
                    </label>
                    <InputSelect
                      options={vitalStatus}
                      onOptionChange={handleChangeSelect}
                      object="father_status"
                      style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
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
                      autoComplete="off"
                      type="text"
                      maxLength={5}
                      {...register("father_postalcode", {
                        required:
                          showFormFather && showFormNewParent === "No"
                            ? "Se requiere el código postal del padre"
                            : false,
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
                      onChange={(e) =>
                        handleChangeInput(
                          e,
                          "father_postalcode",
                          "number",
                          "father"
                        )
                      }
                      min={0}
                    />
                    {fatherSuggestions.length > 0 && (
                      <ul className="absolute z-50 left-0 mt-1 p-2 bg-white border rounded-md shadow-md">
                        {fatherSuggestions.map((address) => (
                          <li
                            key={address.id}
                            onClick={() =>
                              handleSelectAddress(address, "father")
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
                      {...register("father_colony", {
                        required:
                          showFormFather && showFormNewParent === "No"
                            ? "Se requiere la colonia del padre"
                            : false,
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
                      {...register("father_street", {
                        required:
                          showFormFather && showFormNewParent === "No"
                            ? "Se requiere la calle del padre"
                            : false,
                        maxLength: {
                          value: 30,
                          message:
                            "La calle del padre no debe exceder los 30 caracteres",
                        },
                      })}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    />
                  </div>
                  {!showFormMother && !showFormTutor && (
                    <p className="w-full font-medium font-serif text-lg">
                      Nota: Debido a que sólo se registrará el padre, el padre
                      será agregado como el tutor del estudiante.
                    </p>
                  )}
                </>
              )}
              {/* Formulario de la madre */}
              {showFormMother && (
                <>
                  <h2 className="w-full font-medium font-serif text-2xl">
                    Datos de la madre
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
                      {...register("mother_firstname", {
                        required:
                          showFormMother && showFormNewParent === "No"
                            ? "Se requiere el nombre de la madre"
                            : false,
                        maxLength: {
                          value: 20,
                          message:
                            "El nombre de la madre no debe exceder los 20 caracteres",
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
                      {...register("mother_lastnamepaternal", {
                        required:
                          showFormMother && showFormNewParent === "No"
                            ? "Se requiere el primer apellido de la madre"
                            : false,
                        maxLength: {
                          value: 20,
                          message:
                            "El primer apellido de la madre no debe exceder los 20 caracteres",
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
                      {...register("mother_lastnamematernal", {
                        required:
                          showFormMother && showFormNewParent === "No"
                            ? "Se requiere el segundo apellido de la madre"
                            : false,
                        maxLength: {
                          value: 20,
                          message:
                            "El segundo apellido de la madre no debe exceder los 20 caracteres",
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
                      {...register("mother_curp", {
                        required:
                          showFormMother && showFormNewParent === "No"
                            ? "Se requiere la CURP de la madre"
                            : false,
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
                      RFC
                    </label>
                    <input
                      type="text"
                      maxLength={13}
                      {...register("mother_rfc", {
                        maxLength: {
                          value: 13,
                          message:
                            "El RFC de la madre no debe exceder los 13 caracteres",
                        },
                        pattern: {
                          value: /^[A-ZÑ]{4}[0-9]{6}[A-ZÑ0-9]{0,}$/,
                          message:
                            "RFC de la madre es inválido. Verifique el formato y que las letras sean mayúsculas.",
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
                      {...register("mother_birthdate", {
                        required:
                          showFormMother && showFormNewParent === "No"
                            ? "Se requiere la fecha de nacimiento de la madre"
                            : false,
                      })}
                      onChange={(e) => handleChangeInput(e, "mother_birthdate")}
                      ref={dateInputRef}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    />
                  </div>
                  <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                    <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                      Email
                    </label>
                    <input
                      type="email"
                      maxLength={30}
                      {...register("mother_email", {
                        maxLength: {
                          value: 30,
                          message:
                            "El email de la madre no debe exceder los 30 caracteres",
                        },
                      })}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
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
                      {...register("mother_phonenumber", {
                        pattern: {
                          value: /^[0-9]+$/,
                          message:
                            "Solo se permiten números en el teléfono de la madre",
                        },
                        maxLength: {
                          value: 10,
                          message:
                            "El teléfono de la madre debe tener 10 números",
                        },
                        minLength: {
                          value: 10,
                          message:
                            "El teléfono de la madre debe tener 10 números",
                        },
                      })}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                      onChange={(e) =>
                        handleChangeInput(e, "mother_phonenumber", "number")
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
                      object="mother_status"
                      style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
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
                      autoComplete="off"
                      type="text"
                      maxLength={5}
                      {...register("mother_postalcode", {
                        required:
                          showFormMother && showFormNewParent === "No"
                            ? "Se requiere el código postal de la madre"
                            : false,
                        pattern: {
                          value: /^[0-9]+$/,
                          message:
                            "Solo se permiten números en el código postal de la madre",
                        },
                        maxLength: {
                          value: 5,
                          message:
                            "El código postal de la madre no debe exceder los 5 caracteres",
                        },
                        min: {
                          value: 1,
                          message: "Código postal de la madre es inválido",
                        },
                      })}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                      onChange={(e) =>
                        handleChangeInput(
                          e,
                          "mother_postalcode",
                          "number",
                          "mother"
                        )
                      }
                      min={0}
                    />
                    {motherSuggestions.length > 0 && (
                      <ul className="absolute z-50 left-0 mt-1 p-2 bg-white border rounded-md shadow-md">
                        {motherSuggestions.map((address) => (
                          <li
                            key={address.id}
                            onClick={() =>
                              handleSelectAddress(address, "mother")
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
                      {...register("mother_colony", {
                        required:
                          showFormMother && showFormNewParent === "No"
                            ? "Se requiere la colonia de la madre"
                            : false,
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
                      {...register("mother_street", {
                        required:
                          showFormMother && showFormNewParent === "No"
                            ? "Se requiere la calle de la madre"
                            : false,
                        maxLength: {
                          value: 30,
                          message:
                            "La calle de la madre no debe exceder los 30 caracteres",
                        },
                      })}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    />
                  </div>
                  {!showFormFather && !showFormTutor && (
                    <p className="w-full font-medium font-serif text-lg">
                      Nota: Debido a que sólo se registrará la madre, la madre
                      será agregado como el tutor del estudiante.
                    </p>
                  )}
                </>
              )}
              {showFormFather && showFormMother && !showFormTutor && (
                <>
                  <p className="w-full font-medium font-serif text-lg">
                    Seleccione quien será el tutor del estudiante:
                  </p>
                  <div className="relative flex-1 max-w-[200px]">
                    <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                      Tutor:<span className="text-red-500">*</span>
                    </label>
                    <InputSelect
                      options={["Madre", "Padre"]}
                      onOptionChange={handleChangeSelect}
                      object="isTutor"
                      style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    />
                  </div>
                </>
              )}
              {/* Formulario del tutor */}
              {showFormTutor && (
                <>
                  <h2 className="w-full font-medium font-serif text-2xl">
                    Datos del tutor
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
                      {...register("tutor_firstname", {
                        required:
                          showFormTutor && showFormNewParent === "No"
                            ? "Se requiere el nombre del tutor"
                            : false,
                        maxLength: {
                          value: 20,
                          message:
                            "El nombre del tutor no debe exceder los 20 caracteres",
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
                      {...register("tutor_lastnamepaternal", {
                        required:
                          showFormTutor && showFormNewParent === "No"
                            ? "Se requiere el primer apellido del tutor"
                            : false,
                        maxLength: {
                          value: 20,
                          message:
                            "El primer apellido del tutor no debe exceder los 20 caracteres",
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
                      {...register("tutor_lastnamematernal", {
                        required:
                          showFormTutor && showFormNewParent === "No"
                            ? "Se requiere el segundo apellido del tutor"
                            : false,
                        maxLength: {
                          value: 20,
                          message:
                            "El segundo apellido del tutor no debe exceder los 20 caracteres",
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
                      {...register("tutor_curp", {
                        required:
                          showFormTutor && showFormNewParent === "No"
                            ? "Se requiere la CURP del tutor"
                            : false,
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
                  <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                    <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                      RFC
                    </label>
                    <input
                      type="text"
                      maxLength={13}
                      {...register("tutor_rfc", {
                        maxLength: {
                          value: 13,
                          message:
                            "El RFC del tutor no debe exceder los 13 caracteres",
                        },
                        pattern: {
                          value: /^[A-ZÑ]{4}[0-9]{6}[A-ZÑ0-9]{0,}$/,
                          message:
                            "RFC del tutor es inválido. Verifique el formato y que las letras sean mayúsculas.",
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
                      {...register("tutor_birthdate", {
                        required:
                          showFormTutor && showFormNewParent === "No"
                            ? "Se requiere la fecha de nacimiento del tutor"
                            : false,
                      })}
                      onChange={(e) => handleChangeInput(e, "tutor_birthdate")}
                      ref={dateInputRef}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    />
                  </div>
                  <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                    <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                      Email
                    </label>
                    <input
                      type="email"
                      maxLength={30}
                      {...register("tutor_email", {
                        maxLength: {
                          value: 30,
                          message:
                            "El email del tutor no debe exceder los 30 caracteres",
                        },
                      })}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
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
                      {...register("tutor_phonenumber", {
                        pattern: {
                          value: /^[0-9]+$/,
                          message:
                            "Solo se permiten números en el teléfono del tutor",
                        },
                        maxLength: {
                          value: 10,
                          message:
                            "El teléfono del tutor debe tener 10 números",
                        },
                        minLength: {
                          value: 10,
                          message:
                            "El teléfono del tutor debe tener 10 números",
                        },
                      })}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                      onChange={(e) =>
                        handleChangeInput(e, "tutor_phonenumber", "number")
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
                      object="tutor_status"
                      style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    />
                  </div>
                  <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
                    <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                      Género<span className="text-red-500">*</span>
                    </label>
                    <InputSelect
                      options={genders}
                      onOptionChange={handleChangeSelect}
                      object="tutor_gender"
                      style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
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
                      autoComplete="off"
                      type="text"
                      maxLength={5}
                      {...register("tutor_postalcode", {
                        required:
                          showFormTutor && showFormNewParent === "No"
                            ? "Se requiere el código postal del tutor"
                            : false,
                        pattern: {
                          value: /^[0-9]+$/,
                          message:
                            "Solo se permiten números en el código postal del tutor",
                        },
                        maxLength: {
                          value: 5,
                          message:
                            "El código postal del tutor no debe exceder los 5 caracteres",
                        },
                        min: {
                          value: 1,
                          message: "Código postal del tutor es inválido",
                        },
                      })}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                      onChange={(e) =>
                        handleChangeInput(
                          e,
                          "tutor_postalcode",
                          "number",
                          "tutor"
                        )
                      }
                      min={0}
                    />
                    {tutorSuggestions.length > 0 && (
                      <ul className="absolute z-50 left-0 mt-1 p-2 bg-white border rounded-md shadow-md">
                        {tutorSuggestions.map((address) => (
                          <li
                            key={address.id}
                            onClick={() =>
                              handleSelectAddress(address, "tutor")
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
                      {...register("tutor_colony", {
                        required:
                          showFormTutor && showFormNewParent === "No"
                            ? "Se requiere la colonia del tutor"
                            : false,
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
                      {...register("tutor_street", {
                        required:
                          showFormTutor && showFormNewParent === "No"
                            ? "Se requiere la calle del tutor"
                            : false,
                        maxLength: {
                          value: 30,
                          message:
                            "La calle del tutor no debe exceder los 30 caracteres",
                        },
                      })}
                      className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                    />
                  </div>
                </>
              )}
            </>
          )}
          {showFormNewParent === "Yes" && (
            <>
              <p className="w-full font-serif text-lg">
                En caso de que el tutor sea uno de los padres, deje el campo
                vacío.
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
          )}
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
