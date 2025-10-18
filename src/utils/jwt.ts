import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const generateToken = (payload: object): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' });

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
}