declare global {
  namespace Express {
    interface User extends IInsertUser {}
  }
}
export interface ISignUp {
  password: string;
  email: string;
  provider?: string;
}
export interface IInsertUser extends ISignUp {
  user_id: string;
  created_on: string;
  last_login: string;
  provider: string;
}
export interface IUserDetails {
  phone: string;
  bio: string;
  name: string;
  picture?: string;
}
export interface IUpdateUserDetails extends ISignUp, IUserDetails {
  user_id: string;
}
export enum ProviderList {
  GOOGLE = 'google',
}
