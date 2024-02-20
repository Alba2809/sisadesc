import { formatDateShort } from "@constants/functions";

function Message({ message, image, userLogged }) {
  return (
    <div
      className={`flex flex-row w-full gap-5 items-center ${
        message.sender_id === userLogged ? "justify-end" : ""
      }`}
    >
      {/* {message.receiver_id === userLogged && ( image ? (
        <img
          src={image}
          alt={"Imagen de receicer - " + message.createdAt}
          className="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full"
        />
      ) : (
        <img
          src="https://firebasestorage.googleapis.com/v0/b/sisadesc-ca669.appspot.com/o/avatar%2Favatar_default.jpg?alt=media&token=e4d14e18-f4ae-4777-b35d-d64f0084c0e6"
          alt={"Imagen de perfil default"}
          className="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full"
        />
      ))} */}
      <div className={`flex flex-col gap-2`}>
        <p
          className={`text-gray-500 text-lg p-2 relative ${
            message.sender_id === userLogged ? "bg-[#bfccff] rounded-l-xl rounded-tr-xl" : "bg-[#e3e7f0] rounded-r-xl rounded-tl-xl"
          }`}
        >
          {message.sender_id === userLogged ? (
            <div className="h-0 w-0 border-l-[3px] border-solid border-r-[10px] border-l-transparent border-r-transparent border-b-[15px] border-b-[#bfccff] absolute bottom-0 -right-2 rounded-tl-2xl"></div>
          ) : <div className="h-0 w-0 border-l-[10px] border-solid border-r-[3px] border-l-transparent border-r-transparent border-b-[15px] border-b-[#e3e7f0] absolute bottom-0 -left-2 rounded-tl-2xl"></div>}

          {message.message}
        </p>
        <p className={`text-xs text-gray-500 ${message.sender_id === userLogged ? "text-end" : "text-start"}`}>
          {formatDateShort(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default Message;
