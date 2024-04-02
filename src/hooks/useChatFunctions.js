import { useState } from "react";

export function useChatFunctions() {
  const [loading, setLoading] = useState(true);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [file, setFile] = useState(null);
  const [conversationsView, setConversationsView] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [userSelected, setUserSelected] = useState(null);
  const lastMessageRef = useRef(null);

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

  return {};
}
