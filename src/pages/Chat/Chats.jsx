import { useChat } from "@context/ChatContext";
import { useAuth } from "@context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useForm } from "react-hook-form";
import Conversation from "@components/Chat/Conversation";
import Message from "@components/Chat/Message";

function Chats() {
  const { getConversations, getMessages, sendMessage, messages, setMessages } =
    useChat();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [conversationsView, setConversationsView] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [userSelected, setUserSelected] = useState(null);
  const { register, handleSubmit, setValue } = useForm();
  const lastMessageRef = useRef(null);

  useEffect(() => {
    const time = setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(time);
  }, [messages]);

  useEffect(() => {
    async function getConversationsData() {
      const res = await getConversations();
      if (res) {
        setConversations(res);
        setConversationsView(res);
      }
      setLoading(false);
    }
    if (loading) getConversationsData();
  }, [loading]);

  useEffect(() => {
    if (userSelected) {
      async function getMessagesData() {
        await getMessages(userSelected.id);
      }
      getMessagesData();
    }
  }, [userSelected]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await sendMessage(data, userSelected.id);
      if (res?.statusText === "OK") {
        setValue("message", "");
        setMessages([...messages, res.data]);
      }
    } catch (error) {
      console.log(error);
    }
  });

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (e.target.value === "") setLoading(true);

      const filteredObjects = conversations.filter((user) =>
        Object.entries(user).some(
          ([key, value]) =>
            key !== "id" &&
            key !== "birthdate" &&
            key !== "curp" &&
            key !== "imageperfile" &&
            key !== "phonenumber" &&
            key !== "rfc" &&
            (typeof value === "string" || typeof value === "number") &&
            value
              .toString()
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
        )
      );
      setConversationsView(filteredObjects);
    }
  };

  const handleUserSelect = (user) => {
    setUserSelected(user);
  };

  return (
    <div className="w-full h-full flex flex-row gap-5">
      <section className="max-h-full h-full max-w-[300px] w-full p-5 bg-white rounded-lg flex flex-col gap-5">
        <input
          type="text"
          className="w-full py-1 px-3 border border-gray-300 text-gray-500 focus:border-blue-500 focus:border-2 focus:outline-none rounded-md"
          placeholder="Buscar..."
          onKeyDown={handleSearch}
        />
        <ul
          className="max-h-full h-full overflow-y-auto flex flex-col"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#a5a5a5 transparent",
          }}
        >
          {conversationsView.map((conversation, i) => (
            <Conversation
              key={i}
              data={conversation}
              selected={userSelected?.id === conversation.id}
              handleClick={handleUserSelect}
            />
          ))}
        </ul>
      </section>
      <section className="p-5 bg-gray-50 rounded-lg w-full">
        {userSelected ? (
          <div className="w-full h-full flex flex-col gap-5">
            <header className="h-[50px] w-full flex flex-wrap items-center bg-gray-100 rounded-lg p-2 text-gray-500 gap-4">
              <h2>Para:</h2>
              <h1 className="text-lg">{`${userSelected.firstname} ${userSelected.lastnamepaternal} ${userSelected.lastnamematernal} `}</h1>
            </header>
            <section
              className="max-h-full overflow-y-auto overflow-x-hidden flex flex-col gap-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#a5a5a5 transparent",
              }}
            >
              {messages?.length <= 0 && (
                <p className="text-gray-400">Sin mensajes.</p>
              )}
              {messages?.map((message, i) => (
                <div key={i} ref={lastMessageRef}>
                  <Message message={message} userLogged={user.id} />
                </div>
              ))}
            </section>
            <footer>
              <form onSubmit={onSubmit} className="flex flex-row gap-2">
                <input
                  type="text"
                  {...register("message", {
                    required: "Se requiere el mensaje",
                  })}
                  placeholder="Escriba su mensaje"
                  className="flex-1 text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-[50px] flex justify-center items-center hover:bg-slate-200 rounded-md"
                >
                  <IoIosSend size="2em" />
                </button>
              </form>
            </footer>
          </div>
        ) : (
          <p>Seleccione un usuario para ver sus mensajes</p>
        )}
      </section>
    </div>
  );
}

export default Chats;
