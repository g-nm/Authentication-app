import { Pool } from 'pg';
import { IUpdateUserDetails, IUserDetails } from '../types/types';
import { hashPassword } from '../scripts/password';

export const UpdateUserDetails = async (
  pool: Pool,
  userDetails: IUpdateUserDetails
): Promise<IUpdateUserDetails> => {
  console.log('got called', userDetails);
  const client = await pool.connect();
  try {
    const selectQuery = 'SELECT * FROM user_details where user_id=$1';
    const result = await pool.query(selectQuery, [userDetails.user_id]);
    const user = <IUserDetails[]>result.rows;
    let userResponse: IUpdateUserDetails = userDetails;
    await client.query('BEGIN');
    if (user.length === 0) {
      const insertNewUserDetails =
        'INSERT INTO user_details(phone,bio,name,picture,user_id) VALUES ($1,$2,$3,$4,$5) RETURNING phone,bio,name,picture';
      const values = [
        userDetails.phone,
        userDetails.bio,
        userDetails.name,
        userDetails.picture || '',
        userDetails.user_id,
      ];
      const { rows } = await client.query(insertNewUserDetails, values);
      console.log(rows);
      userResponse = rows[0];
    } else if (user.length === 1) {
      const updateUserDetailsQuery =
        ' UPDATE user_details SET phone=$1,bio=$2,name=$3,picture=$4 WHERE user_id=$5 RETURNING phone,bio,name,picture';
      const updateValues = [
        userDetails.phone,
        userDetails.bio,
        userDetails.name,
        userDetails.picture || '',
        userDetails.user_id,
      ];
      const { rows } = await client.query(updateUserDetailsQuery, updateValues);
      userResponse = rows[0];
    }

    const updateUsersQuery =
      'UPDATE users SET email=$1,password=$2 WHERE user_id=$3 RETURNING email';
    const password = userDetails.password
      ? await hashPassword(userDetails.password)
      : 'password';
    const values = [userDetails.email, password, userDetails.user_id];

    const { rows } = await client.query(updateUsersQuery, values);
    userResponse = {
      ...userResponse,
      ...(rows[0] as Record<'email', string>),
      password: '',
      user_id: '',
    };

    await client.query('COMMIT');
    return userResponse;
  } catch (error) {
    console.log('an error occurred');
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const UpdateUserLoginTime = async (uuid: string, pool: Pool) => {
  const updateQuery = 'UPDATE users SET last_login=NOW() WHERE user_id=$1';
  await pool.query(updateQuery, [uuid]);
  return;
};
