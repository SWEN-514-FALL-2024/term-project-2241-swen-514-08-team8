import Cookies from 'js-cookie';

export const setToken = (token: string) => {
  Cookies.set("accessToken", token, { expires: 1 });
};

export const hasToken = () => {
  return getTokens() !== undefined;
};

export const getTokens = () => {
  return Cookies.get("accessToken") || "";
};

export const clearTokens = () => {
  Cookies.remove("accessToken");
};
 