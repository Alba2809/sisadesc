import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";
import { LuFileCheck } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { blobToBase64, base64ToPDF } from "../../utils/functions";
import Conversation from "../../components/Chat/Conversation";
import Message from "../../components/Chat/Message";
import TextareaAutosize from "react-textarea-autosize";
import UploadFileChat from "../../components/UploadFileChat";

function Chats() {
  const {
    getConversations,
    getMessages,
    sendMessage,
    messages,
    setMessages,
    getFileOfMessage,
  } = useChat();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [focusMessage, setFocusMessage] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [file, setFile] = useState(null);
  const [conversationsView, setConversationsView] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [userSelected, setUserSelected] = useState(null);
  const lastMessageRef = useRef(null);
  const { register, handleSubmit, setValue, unregister } = useForm();

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
      if (sending) return;
      if (!data.file && data.message === "") return;
      setSending(true);
      if (data.file) {
        const fileData = await blobToBase64(data.file);
        data.fileData = fileData;
        data.fileName = data.file.name;
      }
      const res = await sendMessage(data, userSelected.id);
      if (res?.statusText === "OK") {
        setValue("message", "");
        setTextAreaValue("");
        setMessages([...messages, res.data]);
        unregister("file");
        setFile(null);
      }
      setSending(false);
    } catch (error) {
      console.log(error);
      setSending(false);
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

  const handleInput = (event) => {
    setValue("message", event.target.value);
    setTextAreaValue(event.target.value);
  };

  const onFileChange = (file) => {
    setValue("file", file);
    setFile(file);
  };

  const handleDownloadFile = async (messageId) => {
    try {
      const file = await getFileOfMessage(messageId);
      await base64ToPDF(file.fileData, file.fileName);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    unregister("file");
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
              className="max-h-full overflow-y-auto overflow-x-hidden flex-1 flex flex-col gap-3"
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
                  <Message
                    message={message}
                    userLogged={user.id}
                    onClickFile={handleDownloadFile}
                  />
                </div>
              ))}
            </section>
            <footer>
              <form
                onSubmit={onSubmit}
                className="flex flex-row gap-2 relative"
              >
                {file && (
                  <button
                    type="button"
                    className="flex flex-wrap gap-2 items-center absolute -top-[33px]"
                    onClick={handleDeleteFile}
                  >
                    <LuFileCheck color="green" size="1.5em" />
                    <p className="text-gray-500 text-xs">{file.name}</p>
                  </button>
                )}
                <div
                  className={`flex-1 px-4 py-3 text-black rounded-md ${
                    focusMessage
                      ? "border-blue-400 border outline-none"
                      : "border border-gray-300"
                  }`}
                >
                  <TextareaAutosize
                    onFocus={() => setFocusMessage(true)}
                    onBlur={() => setFocusMessage(false)}
                    className="w-full h-full resize-none focus:outline-none bg-transparent"
                    style={{
                      scrollbarWidth: "none",
                    }}
                    maxRows={4}
                    minRows={1}
                    onInput={handleInput}
                    value={textAreaValue}
                  />
                </div>
                <input
                  type="text"
                  {...register("message", {
                    required: false,
                  })}
                  className="hidden"
                  hidden
                />
                <div className="w-[50px]">
                  <UploadFileChat
                    onFileChange={onFileChange}
                    cancelFile={file ? false : true}
                  />
                </div>
                <button
                  type="submit"
                  className="w-[50px] flex justify-center items-center hover:bg-slate-200 rounded-md"
                >
                  {sending ? (
                    <AiOutlineLoading size="2em" className="animate-spin" />
                  ) : (
                    <IoIosSend size="2em" />
                  )}
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
