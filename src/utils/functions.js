export function extractTime(date) {
  const newDate = new Date(date);
  const hours = padZero(newDate.getHours());
  const minutes = padZero(newDate.getMinutes());
  return `${hours}:${minutes}`;
}

function padZero(number) {
  return number.toString().padStart(2, "0");
}

export const formatDateLong = (dateString, utc) => {
  if (dateString === "" || !dateString) return "";
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  if (utc) options.timeZone = "UTC";
  const formattedDate = new Date(dateString).toLocaleDateString(
    "es-MX",
    options
  );
  return formattedDate;
};

export const formatDateShort = (date) => {
  if (date === "" || !date) return "";
  const newDate = new Date(date);
  const year = newDate.getUTCFullYear();
  let month = newDate.getUTCMonth() + 1;
  let day = newDate.getUTCDate();

  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }
  return `${year}-${month}-${day}`;
};

export const formatDateTime = (date) => {
  const newDate = new Date(date).toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return newDate;
};

export const scrollToTop = () => {
  document.getElementById("container").scrollTo({ top: 0, behavior: "smooth" });
};

export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result);
      // "data:image/jpg;base64,    =sdCXDSAsadsadsa"
    };
  });
};

export const readImageInBase64 = async (file) => {
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  return new Promise((resolve, reject) => {
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
  });
};

export const base64ToPDF = async (base64, fileName) => {
  const decodedData = atob(base64.split("base64,")[1]);

  const arrayBuffer = new ArrayBuffer(decodedData.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < decodedData.length; i++) {
    uint8Array[i] = decodedData.charCodeAt(i);
  }

  const blob = new Blob([arrayBuffer], { type: "application/pdf" });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
};

export const groupArray = (array, groupSize) => {
  const organizedArray = Array.from(
    { length: Math.ceil(array.length / groupSize) },
    (_, index) => array.slice(index * groupSize, (index + 1) * groupSize)
  );

  return organizedArray;
};