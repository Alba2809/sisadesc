import { useRef, useState } from "react";
import toast from "react-hot-toast";
import UserDefault from "../assets/icons/avatar_default.jpg";

function UploadImagePerfile({ user, onFileChange }) {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
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
      if (onFileChange) onFileChange(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <button
        className="w-full h-full flex items-center text-black rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
        onClick={handleButtonClick}
        type="button"
      >
        <p className="bg-[#e9ecef] px-4 py-3 rounded-l-md">
          Seleccionar imagen
        </p>
        <div className="flex-1 flex justify-center">
          <img
            src={
              user.imageperfile && !previewImage
                ? user.imageperfile
                : previewImage
                ? previewImage
                : UserDefault
            }
            alt="File Input"
            className={`rounded-full ${
              user.imageperfile || previewImage
                ? "min-w-10 min-h-10 max-w-10 max-h-10 mr-1"
                : "min-w-12 min-h-12 max-w-12 max-h-12"
            }`}
          />
        </div>
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        hidden
      />
    </>
  );
}

export default UploadImagePerfile;
