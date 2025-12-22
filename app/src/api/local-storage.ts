const ITEM_NAME = 'auth_token';

export const getAuthToken = () => {
  return localStorage.getItem(ITEM_NAME);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(ITEM_NAME, token);
};
