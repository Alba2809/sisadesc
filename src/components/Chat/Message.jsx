import { formatDateShort, extractTime } from "../../utils/functions";
import { useState } from "react";
import { LuFileDown } from "react-icons/lu";

function Message({ message, userLogged, onClickFile }) {
  const [isHover, setIsHover] = useState(null);

  const handleMouseEnter = () => {
    setIsHover(message.id)
  };

  const handleMouseLeave = () => {
    setIsHover(null)
  };

  const handleClickFile = (messageId) => {
    if(onClickFile) onClickFile(messageId)
  };

  return (
    <div
      className={`flex flex-row w-full gap-5 items-center ${
        message.sender_id === userLogged ? "justify-end" : ""
      }`}
    >
      <div className={`flex flex-col gap-2`}>
        <div
          className={`text-gray-500 text-lg p-2 relative ${
            message.sender_id === userLogged
              ? "bg-[#bfccff] rounded-l-xl rounded-tr-xl"
              : "bg-[#e3e7f0] rounded-r-xl rounded-tl-xl"
          }`}
        >
          {message.hasFile === 1 && (
            <button type="button" className="flex flex-wrap items-center relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => handleClickFile(message.id)}>
              <LuFileDown color="gray" size="1.8em" />
              <p
                className={`absolute z-20 text-gray-100 text-sm rounded-md bg-[#b2b2b2] text-center px-2 py-0 top-0 ${message.sender_id === userLogged ? "right-[110%]" : "left-[110%]"} ${
                  isHover === message.id ? "visible" : "hidden"
                }`}
              >
                Descargar
              </p>
            </button>
          )}
          {message.sender_id === userLogged ? (
            <div className="h-0 w-0 border-l-[3px] border-solid border-r-[10px] border-l-transparent border-r-transparent border-b-[15px] border-b-[#bfccff] absolute bottom-0 -right-2 rounded-tl-2xl"></div>
          ) : (
            <div className="h-0 w-0 border-l-[10px] border-solid border-r-[3px] border-l-transparent border-r-transparent border-b-[15px] border-b-[#e3e7f0] absolute bottom-0 -left-2 rounded-tl-2xl"></div>
          )}

          <p>{message.message}</p>
        </div>
        <p
          className={`text-xs text-gray-500 ${
            message.sender_id === userLogged ? "text-end" : "text-start"
          }`}
        >
          {formatDateShort(message.createdAt)} {extractTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default Message;
