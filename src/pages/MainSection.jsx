import { useAuth } from "@context/AuthContext";
import { useEffect, useState } from "react";

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
    </>
  );
}

export default WelcomeSection;
