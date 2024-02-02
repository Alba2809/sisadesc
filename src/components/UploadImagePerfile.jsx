import { useRef, useState } from "react";

function UploadImagePerfile({ user, onFileChange }) {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
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
        <p className="flex-1 px-4 py-3 text-start">
          {user.imageperfile || previewImage ? "" : "Sin imagen seleccionada"}
        </p>
        <img
          src={
            user.imageperfile && !previewImage
              ? user.imageperfile
              : previewImage
              ? previewImage
              : "https://firebasestorage.googleapis.com/v0/b/sisadesc-ca669.appspot.com/o/avatar%2Favatar_default.jpg?alt=media&token=e4d14e18-f4ae-4777-b35d-d64f0084c0e6"
          }
          alt="File Input"
          className={`rounded-full ${
            user.imageperfile || previewImage
              ? "min-w-10 min-h-10 max-w-10 max-h-10 mr-1"
              : "min-w-12 min-h-12 max-w-12 max-h-12"
          }`}
        />
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
