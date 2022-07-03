import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'pg';
import { selectIfEmailExist } from './select';
import { hashPassword } from '../scripts/password';
import { IInsertUser, ISignUp, ProviderList } from '../types/types';
import { Profile } from 'passport-google-oauth20';
import { AppError } from '../scripts/error';

export const InsertUser = async (
  user: ISignUp,
  pool: Pool
): Promise<IInsertUser> => {
  const inserQueryText =
    'INSERT INTO users(user_id,email,password,created_on,last_login,provider) VALUES($1,$2,$3,NOW(),NOW(),$4) RETURNING *';

  try {
    const isEmailUsed = await selectIfEmailExist(user.email, pool);
    if (isEmailUsed) {
      throw new AppError('User already exists');
    }

    const hashedPassword = await hashPassword(user.password);

    const values: Array<string> = [
      uuidv4(),
      user.email,
      hashedPassword,
      user.provider || 'user',
    ];

    const insertResults = await pool.query(inserQueryText, values);

    return <IInsertUser>insertResults.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw Error(String(error));
  }
};
export const InsertUserFromProvider = async (
  profile: Profile,
  provider: ProviderList,
  pool: Pool
): Promise<IInsertUser> => {
  try {
    if (!profile.emails) {
      throw new AppError('No email Shared');
    }
    const email = profile.emails[0].value;
    const isEmailUsed = await selectIfEmailExist(email, pool);
    if (isEmailUsed) {
      throw new AppError('User already exists');
    }
    const inserQueryText =
      'INSERT INTO users(user_id,email,password,created_on,last_login,provider) VALUES($1,$2,$3,NOW(),NOW(),$4) RETURNING *';

    const values: [Profile['id'], string, string, ProviderList] = [
      profile.id,
      email,
      '',
      provider,
    ];

    const insertResults = await pool.query(inserQueryText, values);

    return insertResults.rows[0] as IInsertUser;
    // console.log(insertResults);
  } catch (e) {
    throw e;
  }
};
