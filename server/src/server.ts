import express, {
  Express,
  Response,
  Request,
  ErrorRequestHandler,
} from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import pgsession from 'connect-pg-simple';
import postgresPool from './config/postgresdb';
import passport from 'passport';
import { isRequestAuthenticated } from './middleware/AuthMiddleware';
import { insertUser, selectUserDetails } from './db/index';
dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 8000;
const storeSession = pgsession(session);
require('source-map-support').install();

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://accounts.google.com/*'],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'How are you',
    store: new storeSession({
      pool: postgresPool,
      tableName: 'user_sessions',
      createTableIfMissing: true,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, //1 day
    },
  })
);

import './config/passport';

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req: Request, res: Response) => {
  res.send('The server is live');
});
app.post('/signup', async (req: Request, res: Response, next) => {
  const { email, password } = req.body;
  try {
    const result = await insertUser({ email, password });
    req.logIn(result, (err) => {
      if (!err) {
        res.sendStatus(201);
        return;
      } else {
        res.sendStatus(500);
      }
    });
    return;
  } catch (error) {
    // console.log(error);
    next(error);
  }
});

app.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/login/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.CLIENT_URL,

    successRedirect: `${process.env.CLIENT_URL}/details`,
  })
);

app.post(
  '/login',
  passport.authenticate('local'),
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);
app.get(
  '/details',
  isRequestAuthenticated,
  async (req: Request, res: Response, next) => {
    const user = req.user;
    if (!user) {
      next('no user');
      return;
    }
    try {
      const userDetails = await selectUserDetails(user?.user_id);
      if (!userDetails) {
        res.json({ email: req.user?.email });
        return;
      }

      res.status(200).json({ ...userDetails, email: req.user?.email });
      return;
    } catch (error) {
      next(error);
    }
  }
);

app.put('/details', isRequestAuthenticated, (req: Request, res: Response) => {
  res.status(200).send('Some user details would be updated');
});
app.get('/auth', isRequestAuthenticated, (req: Request, res: Response) => {
  res.sendStatus(200);
});
app.post('/signout', isRequestAuthenticated, (req: Request, res: Response) => {
  req.logOut((err) => {
    if (!err) {
      res.status(200).send('Goodbye');
      return;
    }
    res.sendStatus(500);
    console.log(err);
  });
});

const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response
) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};
app.use(errorHandler);

//no route match
app.use((req: Request, res: Response) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// App structure
/* 
1. There will be a sign up route DONE
    - It will add the user to the database and drop them at the personal info page
    - It will respond with the session
2. Login route  DONE
    - It will check for the user in the db
    - If no  user return an error code and an error of no user found
    - If success return the user's details and the session if none
3. Edit route 
    - It will check if the access token is valid 
        - if not refresh it with the refresh token 
        - if yes continue with the request and update the users details
4. Sign out route 
    - It will check if the session is valid 
        - if no respond with an error of no user found
        - if success remove the session and respond with success and user signed out
        
*/
