// tokenStore.ts
let tokens: string | null = null;

export const setToken = (token: string) => {
  tokens = token;
};

export const hasToken = () => {
  return tokens !== null;
};

export const getTokens = () => {
  return tokens;
};

export const clearTokens = () => {
  tokens = null;
};
 