import { Pool } from 'pg';
import { IUpdateUserDetails, IUserDetails } from '../types/types';
import { hashPassword } from '../scripts/password';

export const UpdateUserDetails = async (
  pool: Pool,
  userDetails: IUpdateUserDetails
) => {
  const client = await pool.connect();
  try {
    const selectQuery = 'SELECT * FROM user_details where user_id=$1';
    const result = await pool.query(selectQuery, [userDetails.user_id]);
    const user = <IUserDetails[]>result.rows;
    await client.query('BEGIN');
    if (user.length === 0) {
      const insertNewUserDetails =
        'INSERT INTO user_details(phone,bio,name,picture) VALUES ($1,$2,$3,$4)';
      const values = [
        userDetails.phone,
        userDetails.bio,
        userDetails.name,
        userDetails.picture,
      ];
      await client.query(insertNewUserDetails, values);
    } else if (user.length === 1) {
      const updateUserDetailsQuery =
        ' UPDATE user_details SET phone=$1,bio=$2,name=$3,picture=$4 WHERE user_id=$5';
      const updateValues = [
        userDetails.phone,
        userDetails.bio,
        userDetails.name,
        userDetails.picture,
        userDetails.user_id,
      ];
      await client.query(updateUserDetailsQuery, updateValues);
    }

    const updateUsersQuery =
      'UPDATE users SET email=$1,password=$2 WHERE user_id=$3';
    const password = await hashPassword(userDetails.password);
    const values = [userDetails.email, password, userDetails.user_id];

    await client.query(updateUsersQuery, values);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  return;
};

export const UpdateUserLoginTime = async (uuid: string, pool: Pool) => {
  const updateQuery = 'UPDATE users SET last_login=NOW() WHERE user_id=$1';
  await pool.query(updateQuery, [uuid]);
  return;
};
