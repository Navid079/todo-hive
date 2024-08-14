import IUserToken from '../interfaces/user-token.interface';

export class UserTokenDto implements Partial<IUserToken> {
  ownerId?: number;
  latestNonce?: string;
}
