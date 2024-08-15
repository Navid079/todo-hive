declare namespace Express {
  export interface Request {
    user?: import('../components/User/models/dto/user.dto').UserDto;
  }
}
