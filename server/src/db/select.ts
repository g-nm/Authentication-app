import { Pool } from 'pg';
import { IUserDetails } from '../types/types';

export const selectIfEmailExist = async (email: string, pool: Pool) => {
  const selectQueryText = 'SELECT * FROM users WHERE email=$1';
  try {
    const result = await pool.query(selectQueryText, [email]);
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      throw Error(error.message);
    }
    throw error;
  }
};
export const selectIfUuidExist = async (uuid: string, pool: Pool) => {
  const selectQueryText = 'SELECT * FROM users WHERE user_id=$1';
  try {
    const result = await pool.query(selectQueryText, [uuid]);
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      throw Error(error.message);
    }
    throw error;
  }
};
export const SelectUserDetails = async (user_id: string, pool: Pool) => {
  const selectUserDetailsQuery = 'SELECT * FROM user_details WHERE user_id=$1';
  try {
    const result = await pool.query(selectUserDetailsQuery, [user_id]);
    if (result.rows.length <= 0) {
      return null;
    }
    const { bio, name, phone, picture } = result.rows[0] as IUserDetails;
    return {
      bio,
      name,
      phone,
      picture,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw Error(error.message);
    }
    throw error;
  }
};
