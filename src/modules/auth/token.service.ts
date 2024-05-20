import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import IWhitelistTokensInput from './interfaces/whitelist-tokens-input.interface';
import { authConstants } from './auth.constants';

@Injectable()
export class TokenService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  accessUserKey(userId: number): string {
    return `access-token-${userId}`;
  }

  refreshUserKey(userId: number): string {
    return `refresh-token-${userId}`;
  }

  async removeUserFromWhitelist(userId: number): Promise<void> {
    await Promise.all([
      this.cacheManager.del(this.accessUserKey(userId)),
      this.cacheManager.del(this.refreshUserKey(userId)),
    ]);
  }

  async addUserToWhitelist(user: IWhitelistTokensInput): Promise<void> {
    await Promise.all([
      this.cacheManager.set(
        this.accessUserKey(user.userId),
        user.accessToken,
        authConstants.whitelist.accessTtl,
      ),
      this.cacheManager.set(
        this.refreshUserKey(user.userId),
        user.refreshToken,
        authConstants.whitelist.refreshTtl,
      ),
    ]);
  }

  async getAccessTokenFromWhitelist(
    userId: number,
  ): Promise<string | undefined> {
    return this.cacheManager.get<string>(this.accessUserKey(userId));
  }

  async getRefreshTokenFromWhitelist(
    userId: number,
  ): Promise<string | undefined> {
    return this.cacheManager.get<string>(this.refreshUserKey(userId));
  }
}
