import { InMemoryRepository } from '../repository/inMemoryDb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../types';

export class AuthService {
  private static repo = InMemoryRepository.getInstance();

  public static async register(name: string, email: string, password: string): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const existing = await this.repo.findUserByEmail(email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await this.repo.createUser(name, email, hash);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...userWithoutPassword } = newUser;
    return { token, user: userWithoutPassword };
  }

  public static async login(email: string, password: string): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const user = await this.repo.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials provided.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash || '');
    if (!isMatch) {
      throw new Error('Invalid credentials provided.');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  public static async getUserById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.repo.findUserById(id);
    if (!user) return null;
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public static async updateProfile(id: string, updates: Partial<User>): Promise<Omit<User, 'passwordHash'> | null> {
    const updated = await this.repo.updateUser(id, updates);
    if (!updated) return null;
    const { passwordHash, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }
}
