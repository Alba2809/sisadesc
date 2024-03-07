import { useEffect, useRef } from "react";
import { LuFileUp } from "react-icons/lu";

function UploadFileChat({ onFileChange, cancelFile }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (cancelFile) fileInputRef.current.value = "";
  }, [cancelFile]);

  return (
    <>
      <button
        type="button"
        className="w-full h-full flex justify-center items-center hover:bg-slate-200 rounded-md"
        onClick={handleButtonClick}
      >
        <LuFileUp color="black" size="1.8em" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="application/pdf"
      />
    </>
  );
}

export default UploadFileChat;
