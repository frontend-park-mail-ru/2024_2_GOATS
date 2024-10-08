export const timeFormatter = (timeInput: number) => {
  const minute = Math.floor(timeInput / 60);
  const minuteString = minute < 10 ? '0' + minute : minute;
  const second = Math.floor(timeInput % 60);
  const secondString = second < 10 ? '0' + second : second;
  return `${minuteString}:${secondString}`;
};
