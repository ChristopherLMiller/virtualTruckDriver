import bcrypt from 'bcrypt';

const saltRound = 10;

export const getHashedPassword = (password: string) =>
  bcrypt.hashSync(password, saltRound);

export const isAuthorized = (password: string, comparePassword: string) =>
  bcrypt.compareSync(password, getHashedPassword(comparePassword));
