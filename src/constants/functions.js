export const formatDateLong = (dateString) => {
  if (dateString === "") return "";
  const options = { year: "numeric", month: "long", day: "numeric", timeZone: "UTC", };
  const formattedDate = new Date(dateString).toLocaleDateString(
    "es-MX",
    options
  );
  return formattedDate;
};

export const formatDateShort = (date) => {
    const newDate = new Date(date)
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
    timeZone: "UTC",
  });
  
  return newDate;
};
