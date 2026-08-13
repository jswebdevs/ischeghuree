import jwt, { SignOptions } from 'jsonwebtoken';

export const generateToken = (userId: string, role: string) => {
  // Configurable session length; defaults to 30 days to prevent frequent logouts.
  const expiresIn = (process.env.JWT_EXPIRES_IN || '30d') as SignOptions['expiresIn'];
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string, {
    expiresIn,
  });
};
