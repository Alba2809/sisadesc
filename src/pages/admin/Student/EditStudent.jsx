import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { formatDateShort } from "../../../utils/functions";
import { genders, grades, groups } from "../../../utils/constants";
import { useAddress } from "../../../hooks/useAddress";
import { useStudent } from "../../../hooks/useStudent";
import InputSelect from "../../../components/InputSelect";
import AlertMessage from "../../../components/AlertMessage";

function EditStudent() {
  const params = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { studentSuggestions, handleChangeCP, handleSelectAddress } =
    useAddress({ setValue });
  const { getStudent, student: object, loading, handleChangeInput, handleChangeSelect, updateStudent, errors: updateErrors } = useStudent({ setValue });
  const navigate = useNavigate();

  useEffect(() => {
    getStudent(params.id);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
      const res = await updateStudent(object.id, data);
      if (res?.statusText === "OK") navigate("/admin/students");
  });

  const dateInputRef = useRef(null);

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Editar estudiante</h1>
      </header>
      <section
        id="container"
        className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
        }}
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
                      handleChangeCP(
                        e,
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
    </div>
  );
}

export default EditStudent;
