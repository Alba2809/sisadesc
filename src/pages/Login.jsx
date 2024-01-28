import { useAuth } from "@context/AuthContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IoMailSharp, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import AlertMessage from "@components/AlertMessage"
import ImagePerson from "@images-login/login.png";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const [seePassword, setSeePassword] = useState(false);

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  return (
    <div className="w-full h-screen flex flex-row justify-center items-center bg-[#f7f7f9]">
      {!isAuthenticated &&
      <section className="grid grid-cols-2 rounded-xl overflow-hidden max-w-[1200px] bg-white">
        <div className="relative bg-[#18aefa] rounded-xl">
          <img src={ImagePerson} alt="Imagen principal de login" className="" />
          {/* <img
            src={LoginIcon1}
            alt="Icono 1"
            className="absolute top-0 left-0 max-w-[13rem] w-full"
          />
          <img
            src={LoginIcon2}
            alt="Icono 2"
            className="absolute top-0 right-0 max-w-[15rem]"
          /> */}
        </div>
        <section className="px-10 flex flex-col justify-center font-sans">
          <h1 className="font-bold text-3xl">Bienvenido al inicio</h1>
          <h2 className="font-medium text-2xl my-3">Iniciar sesión</h2>
          <AnimatePresence mode="sync">
            {signinErrors.map((error, i) => (
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
          </AnimatePresence>
          <form className="" onSubmit={onSubmit}>
            <div className="relative my-5">
              <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                Email<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={50}
                  placeholder="Correo electrónico"
                  {...register("email", {
                    required: "Se requiere el correo electrónico",
                    maxLength: {
                      value: 50,
                      message: "No debe exceder los 50 caracteres",
                    },
                  })}
                  className="w-full text-black px-4 py-3 rounded-md border border-gray-400 focus:border-blue-500 focus:border-2 focus:outline-none"
                />
                <IoMailSharp
                  className="absolute top-[27%] right-5"
                  size="1.5em"
                />
              </div>
            </div>
            <div className="relative my-5">
              <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                Contraseña<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={seePassword ? "text" : "password"}
                  placeholder="Contraseña"
                  maxLength={25}
                  {...register("password", {
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
                  className="w-full text-black px-4 py-2 rounded-md border border-gray-400 focus:border-blue-500 focus:border-2 focus:outline-none"
                />
                {seePassword ? (
                  <IoEyeOffOutline
                    className="absolute top-[22%] right-5 cursor-pointer"
                    size="1.5em"
                    onClick={() => setSeePassword((prev) => !prev)}
                  />
                ) : (
                  <IoEyeOutline
                    className="absolute top-[22%] right-5 cursor-pointer"
                    size="1.5em"
                    onClick={() => setSeePassword((prev) => !prev)}
                  />
                )}
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#3d5ee1] font-medium text-lg text-white px-4 py-2 rounded-md w-full"
            >
              Ingresar
            </button>
          </form>
        </section>
      </section>
      }
    </div>
  );
}

export default Login;
