import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { passwordConstants } from './password.constants';

@Injectable()
export class PasswordService {
  async getHash(password: string): Promise<string> {
    return bcrypt.hash(password, passwordConstants.saltRounds);
  }

  async validate(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
