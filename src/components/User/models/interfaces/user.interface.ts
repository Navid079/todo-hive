export default interface IUser {
  firstName: string;
  lastName?: string;
  username: string;
  password: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  registrationDate: Date;
}
