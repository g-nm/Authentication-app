import bcrypt from 'bcrypt';

export const verifyPassword = async (
  sentPassword: string,
  storedHash: string
) => {
  return await bcrypt.compare(sentPassword, storedHash);
};
export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 8);
  return hashedPassword;
};
