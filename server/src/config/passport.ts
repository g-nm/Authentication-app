import passport from 'passport';
import { IStrategyOptions, Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { verifyPassword } from '../scripts/password';
import postgresPool from './postgresdb';
import { insertUserFromProvider } from '../db';
import { IInsertUser, ProviderList } from '../types/types';
import dotenv from 'dotenv';

dotenv.config({});
const customFields: IStrategyOptions = {
  usernameField: 'email',
  passwordField: 'password',
};

const strategy = new LocalStrategy(
  customFields,
  async (username, password, done) => {
    try {
      const { rows } = await postgresPool.query(
        'SELECT * FROM users WHERE email=$1',
        [username]
      );
      if (rows.length === 0 || rows.length > 1) {
        return done(null, false);
      }
      const user = rows[0] as IInsertUser;
      const checkPassword = await verifyPassword(password, user.password);
      if (!checkPassword) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || '',
    callbackURL: '/login/google/callback',
    scope: ['email', 'profile'],
  },
  async (_accessToken, _refreshToken, profile, done) => {
    const selectquery = 'SELECT * FROM users WHERE provider=$1 AND user_id=$2';
    const values = ['google', profile.id];
    try {
      const result = await postgresPool.query(selectquery, values);
      if (result.rows.length === 0) {
        const user = await insertUserFromProvider(profile, ProviderList.GOOGLE);
        return done(null, user);
      }
      return done(null, result.rows[0]);
    } catch (error) {
      return done(error as Error);
    }
  }
);

passport.use(strategy);
passport.use(googleStrategy);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});
passport.deserializeUser((userId, done) => {
  postgresPool
    .query('SELECT * FROM users WHERE user_id=$1', [userId])
    .then((result) => {
      done(null, result.rows[0]);
    })
    .catch((err) => done(err));
});
