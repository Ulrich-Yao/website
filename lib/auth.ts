import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function authenticateUser(username: string, password: string) {
  try {
    const user = await db.get(
      'SELECT * FROM users WHERE username = ?',  
      [username]
    );

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    return { token, user: { id: user.id, username: user.username } };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
