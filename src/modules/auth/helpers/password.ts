import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PasswordHelper {
  private readonly saltRounds: number;

  constructor() {
    this.saltRounds = Number(process.env.SALT_PASSWORD) || 10;
  }

  async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async createTempToken() {
    const newToken = crypto.randomInt(100000, 999999);
    return newToken;
  }
}
