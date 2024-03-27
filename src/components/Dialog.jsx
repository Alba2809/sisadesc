import { motion } from "framer-motion";
import Loader from "./Loader";

function Dialog({
  title,
  message,
  handleAction,
  addCancel,
  textAccept,
  showLoading,
  contentComponent
}) {
  const handleClick = (option) => {
    if (showLoading) return;
    if (handleAction) return handleAction(option);
  };

  return (
    <div className="absolute top-0 right-0 z-[9990] w-full h-full flex justify-center items-center">
      <motion.div
        className="absolute top-0 w-full h-full z-[9995] bg-gray-400 bg-opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacitiy: 0 }}
        onClick={() => handleClick(false)}
      ></motion.div>
      {showLoading ? (
        <motion.section
          className="flex flex-col bg-white py-5 px-8 rounded-md z-[9999]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
        >
          <Loader />
        </motion.section>
      ) : (
        <motion.section
          className="flex flex-col bg-white p-10 rounded-md z-[9999]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
        >
          <header>
            <h1 className="text-center pb-2 text-[#464d78] font-medium text-2xl">
              {title}
            </h1>
          </header>
          {contentComponent ? <>
          {contentComponent}
          </> : 
          <>
          <p className="text-center text-gray-400 mb-5">{message}</p>
          <footer className="flex flex-row justify-around gap-5">
            <button
              className="min-w-[150px] py-2 px-4 bg-[#3d5ee1] border border-[#3d5ee1] text-white hover:bg-white hover:text-[#3d5ee1] font-medium rounded-md"
              onClick={() => handleClick(true)}
            >
              {textAccept ?? "Aceptar"}
            </button>
            {addCancel && (
              <button
                className="min-w-[150px] py-2 px-4 bg-white border border-[#3d5ee1] text-[#3d5ee1] hover:bg-[#18aefa] hover:text-white font-medium rounded-md"
                onClick={() => handleClick(false)}
              >
                Cancelar
              </button>
            )}
          </footer>
          </>
          }
          
        </motion.section>
      )}
    </div>
  );
}

export default Dialog;
