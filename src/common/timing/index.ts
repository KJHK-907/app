export const fmtTimestamp = (timestamp: string) => {
  if (!timestamp) return null;

  const serverDate = new Date(timestamp.replace(" ", "T"));

  const dateOffset = serverDate.getTimezoneOffset();
  const clientDate = new Date(serverDate.getTime() + dateOffset * 60 * 1000);

  const h = clientDate.getHours() % 12 || 12;
  const m = clientDate.getMinutes();

  const period = clientDate.getHours() < 12 ? "AM" : "PM";

  return `${h}:${m < 10 ? "0" + m : m} ${period}`;
};

export const fmtMSS = (s: number) => {
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${~~seconds}`;
};
