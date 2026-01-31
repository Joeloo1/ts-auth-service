export const genUsername = (): string => {
  const usernamePrifix = "user-";
  const randomChar = Math.random().toString(32).slice(2);

  const username = usernamePrifix + randomChar;

  return username;
};
