import { monthDictionary } from '../consts';

export const dateFormatter = (date: string) => {
  const [year, month, day] = date.split('-');
  const cleanDate = day[0] == '0' ? day.substring(1) : day;
  return cleanDate + ' ' + monthDictionary.get(month) + ' ' + year;
};
