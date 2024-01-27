import { useAuth } from "@context/AuthContext";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  return (
    <div>
      <form className="text-center min-w-[405px]" onSubmit={onSubmit}>
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
          className="w-full text-black px-4 py-2 rounded-md border-2 border-black"
        />
        <input
          type="password"
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
          className="w-full text-black pl-4 pr-10 py-2 rounded-md border-2 border-black block"
        />
        <button
          type="submit"
          className="bg-[#6D1610] font-extrabold text-lg w-[50%] text-white px-4 py-4 rounded-md"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default Login;
