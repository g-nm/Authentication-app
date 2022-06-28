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
import { insertUser, selectUserDetails, UpdateUser } from './db/index';
import { AppError } from './scripts/error';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8000;
const storeSession = pgsession(session);
if (process.env.NODE_ENV === 'development') {
  require('source-map-support').install();
}

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
import { handleFormData } from './middleware/HandleFiles';
import { createUploadFolder } from './scripts/upload';

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
    if (error instanceof AppError) {
      res.status(400).send('Incorrect Credentials');
      return;
    }
    next(error);
  }
});

app.get('/login/failed', (req: Request, res: Response) => {
  res.status(401).send('Incorrect Credentials');
});

app.get(
  '/login/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

app.get(
  '/login/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'login/failed',
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

app.put(
  '/details',
  isRequestAuthenticated,
  handleFormData,
  async (req: Request, res: Response, next) => {
    console.log('got to request');
    try {
      const result = await UpdateUser(res.locals.user);
      console.log('Result of update ', result);
    } catch (error) {
      console.log('error before response', error);
      if (error instanceof AppError) {
        res.status(400);
        return;
      }
      next(error);
      return;
    }
    res.status(200).send('Some user details would be updated');
  }
);
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
app.use(express.static(__dirname + '/uploads'));
const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next
) => {
  if (err instanceof AppError) {
    res.status(500);
    res.send(err.message);
    return;
  }
  next(err);
};
app.use(errorHandler);

app.use((req: Request, res: Response) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, async () => {
  await createUploadFolder();
  console.log(`Server is listening on port ${PORT}`);
});
