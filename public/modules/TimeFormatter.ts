export const timeFormatter = (timeInput: number) => {
  const hours = Math.floor(timeInput / 3600);
  const minutes = Math.floor((timeInput % 3600) / 60);
  const seconds = Math.floor(timeInput % 60);

  const hoursString = hours < 10 ? '0' + hours : hours;
  const minutesString = minutes < 10 ? '0' + minutes : minutes;
  const secondsString = seconds < 10 ? '0' + seconds : seconds;

  if (hours > 0) {
    return `${hoursString}:${minutesString}:${secondsString}`;
  } else {
    return `${minutesString}:${secondsString}`;
  }
};

export const yearPicker = (date: string) => {
  const year = date.split(' ')[2];
  return year;
};
