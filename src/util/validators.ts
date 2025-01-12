export const emailValidator = (email: string) => {
  if (typeof email !== "string") return false;
  const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/;
  return emailRegExp.test(email);
};

export const passwordValidator = (password: string) => {
  if (typeof password !== "string") return false;
  const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,16}$/;
  return passwordRegExp.test(password);
};
