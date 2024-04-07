import { useForm } from "react-hook-form";
import { grades, groups } from "../../../utils/constants";
import { useEffect } from "react";
import { useCounselor } from "../../../hooks/useCounselor";
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import InputSelect from "../../../components/InputSelect";

function RegisterCounselor() {
  const { register, handleSubmit, setValue, formState: { errors }, } = useForm();
  const { createCounselor, handleGroupChange, handleGradeChange } = useCounselor({ setValue });
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const res = await createCounselor(data);
    if (res?.statusText === "OK") navigate("/viceprincipal/counselors");
  });

  useEffect(() => {
    setValue("grade", grades[0]);
    setValue("group", groups[0]);
  }, []);

  useEffect(() => {
    Object.keys(errors).map(
        (error) => toast.error(errors[error].message)
    )
  }, [errors]);

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Asignar asesor</h1>
      </header>
      <section className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto">
        <header className="flex flex-wrap gap-10 items-center justify-center pt-5">
          <div className="relative flex-1">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Seleccione el grupo
            </label>
            <InputSelect
              options={groups}
              onOptionChange={handleGroupChange}
              style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
          <div className="relative flex-1">
            <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
              Seleccione el grado
            </label>
            <InputSelect
              options={grades}
              onOptionChange={handleGradeChange}
              style="px-4 py-3 border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
            />
          </div>
        </header>
        <main>
          <form
            onSubmit={onSubmit}
            className="flex flex-wrap justify-stretch gap-5 gap-y-8 mt-5"
          >
            <div className="relative flex-1 lg:min-w-[30%] sm:min-w-[48%] md:min-w-[48%]">
              <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                CURP del asesor<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={18}
                {...register("counselor_curp", {
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
            <section className="w-full">
              <button
                type="submit"
                className="py-2 px-8 bg-blue-600 hover:bg-[#18aefa] text-white text-lg rounded-lg"
              >
                Asignar
              </button>
            </section>
          </form>
        </main>
      </section>
    </div>
  );
}

export default RegisterCounselor;
