export const checkLocalStorage = () => {
  return localStorage.getItem('last_movies') !== null;
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
