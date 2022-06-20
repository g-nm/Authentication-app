import { Profile } from 'passport-google-oauth20';
import postgresPool from '../config/postgresdb';
import { ISignUp, ProviderList } from '../types/types';
import { InsertUser, InsertUserFromProvider } from './insert';
import { SelectUserDetails } from './select';

const insertUser = (user: ISignUp) => InsertUser(user, postgresPool);
const insertUserFromProvider = (profile: Profile, provider: ProviderList) =>
  InsertUserFromProvider(profile, provider, postgresPool);
const selectUserDetails = (user_id: string) =>
  SelectUserDetails(user_id, postgresPool);

export { insertUser, insertUserFromProvider, selectUserDetails };
