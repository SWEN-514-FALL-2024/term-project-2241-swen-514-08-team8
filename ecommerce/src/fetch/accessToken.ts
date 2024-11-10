// tokenStore.ts
let tokens: string = "";

export const setToken = (token: string) => {
  tokens = token;
};

export const hasToken = () => {
  return tokens !== "";
};

export const getTokens = () => {
  return tokens;
};

export const clearTokens = () => {
  tokens = "";
};
 