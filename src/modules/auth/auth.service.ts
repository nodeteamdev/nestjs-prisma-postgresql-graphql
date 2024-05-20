import { Prisma, User } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password/password.service';
import { Token } from './models/token.model';
import { PrismaService } from '@providers/prisma/prisma.service';
import { authConstants } from './auth.constants';
import SignUpInput from './dto/sign-up.input';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(payload: SignUpInput): Promise<Token> {
    const hashedPassword = await this.passwordService.getHash(payload.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          ...payload,
          email: payload.email.toLowerCase(),
          password: hashedPassword,
          role: 'USER',
        },
      });

      const tokens = this.generateTokens({
        userId: user.id,
      });

      await this.tokenService.addUserToWhitelist({
        ...tokens,
        userId: user.id,
      });

      return tokens;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${payload.email} already used.`);
      }
      throw new Error(e);
    }
  }

  async signIn(email: string, password: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const passwordValid = await this.passwordService.validate(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const tokens = this.generateTokens({
      userId: user.id,
    });

    await this.tokenService.addUserToWhitelist({
      ...tokens,
      userId: user.id,
    });

    return tokens;
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new BadRequestException('User not found');

    return user;
  }

  async getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new BadRequestException('User not found');

    return user;
  }

  generateTokens(payload: { userId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: authConstants.jwt.accessTtl,
    });
  }

  private generateRefreshToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: authConstants.jwt.refreshTtl,
    });
  }

  async refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const savedToken =
        await this.tokenService.getRefreshTokenFromWhitelist(userId);

      if (savedToken !== token) {
        throw new Error('Token mismatch');
      }

      const tokens = this.generateTokens({
        userId,
      });

      await this.tokenService.addUserToWhitelist({
        ...tokens,
        userId,
      });

      return tokens;
    } catch (e) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
  }

  async checkAccess(userId: number, accessToken: string): Promise<boolean> {
    const savedToken =
      await this.tokenService.getAccessTokenFromWhitelist(userId);

    return accessToken === savedToken;
  }

  async forgetUser(userId: number, accessToken: string): Promise<boolean> {
    if (await this.checkAccess(userId, accessToken)) {
      await this.tokenService.removeUserFromWhitelist(userId);

      return true;
    }

    return false;
  }
}
