import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  sign(
    payload: Record<string, unknown>,
    secretPayload: string,
  ): [string, string] {
    const secret = this.configService.get('JWT_SECRET');
    const expiresIn = this.configService.get('JWT_EXPIRE_IN');
    const encryptionKey = this.configService.get('JWT_ENCRYPTION_KEY');

    const iv = crypto.randomBytes(12);

    const accessToken = jwt.sign(payload, secret, { expiresIn });
    const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);

    const refreshToken =
      `$${iv.toString('hex').toUpperCase()}$` +
      cipher.update(secretPayload, 'utf8', 'base64') +
      cipher.final('base64');

    return [accessToken, refreshToken];
  }
}
