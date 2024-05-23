import { passwordConstants } from '@auth/password/password.constants';
import { Role } from '@prisma/client';
import { User } from '@user/models/user.model';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const getMockedPassword = () => `${faker.internet.password({ length: 8 })}$`;
const getMockedUser = (password?: string): User => ({
  id: 1,
  email: `${faker.internet.email()}@example.com.invalid`,
  password: bcrypt.hashSync(
    password || defaultPassword,
    passwordConstants.saltRounds,
  ),
  name: `${faker.internet.displayName()}`,
  role: Role.USER,
  dateCreated: new Date(),
  posts: [],
});

const defaultPassword = getMockedPassword();
const defaultUser = getMockedUser();

export { getMockedPassword, getMockedUser, defaultPassword, defaultUser };
