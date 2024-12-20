import { monthDictionary } from '../consts';

export const dateFormatter = (date: string) => {
  try {
    const [year, month, day] = date.split('-');
    const cleanDate = (day[0] == '0' ? day.substring(1) : day).split('T')[0];
    return cleanDate + ' ' + monthDictionary.get(month) + ' ' + year;
  } catch {
    return '';
  }
};

export const yearPicker = (date: string) => {
  const year = date.split(' ')[2];
  return year;
};
