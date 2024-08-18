export default interface IUserToken {
  latestNonce: string;
  trusted: boolean;

  ownerId: number;
}
