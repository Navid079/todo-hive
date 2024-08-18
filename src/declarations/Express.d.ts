declare namespace Express {
  export interface Request {
    tokenId?: number;
    user?: import('../components/User/models/dto/user.dto').UserDto;
  }
}
