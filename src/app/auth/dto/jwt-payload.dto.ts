import { Role } from '@prisma/client';

export default class JwtPayloadDto {
  userId: number;

  role: Role;

  email: string;

  name: string | null;
}
