import IUserToken from '../interfaces/user-token.interface';

export class UserTokenDto implements Partial<IUserToken> {
  latestNonce?: string;
  trusted: boolean;

  ownerId?: number;
}
