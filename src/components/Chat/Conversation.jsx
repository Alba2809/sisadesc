function Conversation({ data, selected, handleClick }) {
  return (
    <li className={`w-full flex flex-row items-center gap-3 hover:bg-gray-200 cursor-pointer rounded-md p-3 ${selected ? "bg-gray-200" : "bg-white"}`} onClick={() => handleClick(data)}>
      {data.imageperfile ? (
        <img
          src={data.imageperfile}
          alt={"Imagen de perfil - " + data.id}
          className="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full"
          loading="lazy"
        />
      ) : (
        <img
          src="https://firebasestorage.googleapis.com/v0/b/sisadesc-ca669.appspot.com/o/avatar%2Favatar_default.jpg?alt=media&token=e4d14e18-f4ae-4777-b35d-d64f0084c0e6"
          alt={"Imagen de perfil default"}
          className="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full"
          loading="lazy"
        />
      )}
      {`${data.firstname} ${data.lastnamepaternal} ${data.lastnamematernal}`}
    </li>
  );
}

export default Conversation;
