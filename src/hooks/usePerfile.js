import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { blobToBase64 } from "../utils/functions";
import toast from "react-hot-toast";

export function usePerfile() {
  const { getUser, updateImage, user, errors: updateErrors } = useAuth();
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(user?.imageperfile ?? null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function getUserData() {
      await getUser();
      setPreviewImage(user?.imageperfile ?? null);
      setLoading(false);
    }
    if (loading) getUserData();
  }, [loading]);

  const handleButtonClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 15 * 1024 * 1024) {
          toast.error(
            "La imagen es demasiado grande. Se permite un máximo de 15MB."
          );
          e.target.value = "";
          setPreviewImage(user.imageperfile ?? null);
          return;
        }

        const imagenBase64 = await blobToBase64(file);

        const res = await toast.promise(updateImage({imageperfile: imagenBase64}), {
          loading: "Actualizando imagen...",
          success: "¡Imagen actualizada!",
          error: "¡Error al actualizar!",
        });

        if (res?.statusText === "OK") {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result);
          };
          reader.readAsDataURL(file);
        } else setPreviewImage(user.imageperfile ?? null);
      }
    } catch (error) {
      toast.error("Error al actualizar la imagen");
    }
  };

  return {
    user,
    loading,
    updateErrors,
    handleButtonClick,
    fileInputRef,
    handleFileChange,
    previewImage
  };
}
