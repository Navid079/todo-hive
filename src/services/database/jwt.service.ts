import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

export enum VerifyStatus {
  Verified,
  Expired,
  Rejected,
}

@Injectable()
export default class JwtService {
  constructor(private readonly configService: ConfigService) {}

  sign(
    payload: Record<string, unknown>,
    refreshPayload: string,
  ): [string, string] {
    const secret = this.configService.get('JWT_SECRET');
    const expiresIn = this.configService.get('JWT_EXPIRE_IN');
    const encryptionKey = this.configService.get('JWT_ENCRYPTION_KEY');

    const iv = crypto.randomBytes(12);

    const accessToken = jwt.sign(payload, secret, { expiresIn });
    const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);

    const refreshToken =
      `${iv.toString('hex').toUpperCase()}$` +
      cipher.update(refreshPayload, 'utf8', 'base64') +
      cipher.final('base64') +
      `$${cipher.getAuthTag().toString('hex').toUpperCase()}`;

    return [accessToken, refreshToken];
  }

  verify(
    accessToken: string,
    refreshToken?: string,
  ): [VerifyStatus, Record<string, unknown> | null, string | null] {
    const secret = this.configService.get('JWT_SECRET');
    const encryptionKey = this.configService.get('JWT_ENCRYPTION_KEY');
    try {
      const payload = jwt.verify(accessToken, secret) as Record<
        string,
        unknown
      >;
      return [VerifyStatus.Verified, payload, null];
    } catch (e: unknown) {
      if (!(e instanceof jwt.TokenExpiredError))
        return [VerifyStatus.Rejected, null, null];
      if (!refreshToken) return [VerifyStatus.Rejected, null, null];

      const [ivString, encrypted, tag] = refreshToken.split('$');

      const iv = Buffer.from(ivString, 'hex');

      if (!encrypted) return [VerifyStatus.Rejected, null, null];
      if (!tag) return [VerifyStatus.Rejected, null, null];

      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        encryptionKey,
        iv,
      );

      decipher.setAuthTag(Buffer.from(tag, 'hex'));

      const refreshPayload =
        decipher.update(encrypted, 'base64', 'utf-8') + decipher.final('utf-8');

      const payload = jwt.verify(accessToken, secret, {
        ignoreExpiration: true,
      }) as Record<string, unknown>;

      return [VerifyStatus.Expired, payload, refreshPayload];
    }
  }
}
