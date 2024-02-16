import { useAuth } from "@context/AuthContext";
import { useEffect, useState } from "react";
import ControlAdmin from "@components/admin/ControlAdmin";
import { AdminProvider } from "../context/AdminContext";

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
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">
          Bienvenido {user?.firstname}!
        </h1>
      </header>
      {!loading && (
        <>
          {user.role.name === "admin" ? (
            <AdminProvider>
              <ControlAdmin />
            </AdminProvider>
          ) : (
            console.log("No es un administrador:", user.role.name)
          )}
        </>
      )}
    </>
  );
}

export default WelcomeSection;
