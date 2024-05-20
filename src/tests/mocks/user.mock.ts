import { passwordConstants } from '@auth/password/password.constants';
import { Role } from '@prisma/client';
import { User } from '@user/models/user.model';
import bcrypt from 'bcrypt';
import { randomInt, randomUUID } from 'crypto';

const mockedPassword: string = `${randomUUID()}$`;
const mockedUser: User = {
  id: 1,
  email: `${randomInt(10000)}@example.com.invalid`,
  password: bcrypt.hashSync(mockedPassword, passwordConstants.saltRounds),
  name: `${randomUUID()}`,
  role: Role.USER,
  dateCreated: new Date(),
  posts: [],
};

export { mockedPassword, mockedUser };
