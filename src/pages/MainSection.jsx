import { useAuth } from "@context/AuthContext";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

function WelcomeSection() {
  const { getUser, user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserData() {
      await getUser();
      setLoading(false);
    }
    if (loading) getUserData();
  }, [loading]);

  return (
    <>
      <section className="size-full flex flex-col items-center justify-center gap-y-6">
        {user.imageperfile ? (
          <div className="rounded-full border-2 border-gray-300 p-1">
            <img
              src={user.imageperfile}
              alt="Image del perfil del usuario"
              className="min-w-[280px] min-h-[280px] max-w-[280px] max-h-[280px] rounded-full"
            />
          </div>
        ) : (
          <div className="rounded-full border-2 border-gray-300 p-1">
            <FaUserCircle color="gray" size="17.5em" />
          </div>
        )}
        <h1 className="font-bold font-serif text-4xl">
          Bienvenido {user?.firstname}!
        </h1>
      </section>
    </>
  );
}

export default WelcomeSection;
