import express, {
  Express,
  Response,
  Request,
  ErrorRequestHandler,
  CookieOptions,
} from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import pgsession from 'connect-pg-simple';
import postgresPool from './config/postgresdb';
import passport from 'passport';
import morgan from 'morgan';

import { isRequestAuthenticated } from './middleware/AuthMiddleware';
import { insertUser, selectUserDetails, UpdateUser } from './db/index';
import { AppError } from './scripts/error';
import { handleFormData } from './middleware/HandleFiles';
import { createUploadFolder } from './scripts/upload';

dotenv.config();

const app: Express = express();
const PORT = (process.env.PORT as unknown as number) || 8080;
const storeSession = pgsession(session);
if (process.env.NODE_ENV === 'DEVELOPMENT') {
  require('source-map-support').install();
  app.use(morgan('tiny'));
}

app.use(
  cors({
    origin: [process.env.CLIENT_URL || ''],
    credentials: true,
  })
);
let secure = false;
let sameSite: CookieOptions['sameSite'] = false;
if (process.env.NODE_ENV === 'PRODUCTION') {
  secure = true;
  sameSite = 'none';
  app.set('trust proxy', 3);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    name: 'sessionId',
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
      sameSite,
      secure,
    },
  })
);

import './config/passport';
app.use(passport.initialize());
app.use(passport.session());
// app.disable('x-powered-by');

app.get('/', (req: Request, res: Response) => {
  res.send('The server is live');
});

app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login/failed',
    failureMessage: true,
  }),
  function (req, res) {
    res.sendStatus(200);
  }
);

app.post('/signup', async (req: Request, res: Response, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const result = await insertUser({ email, password });
    req.logIn(result, (err) => {
      console.log(err);

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
app.get('/login/success', (req: Request, res: Response) => {
  console.log(req.user);
  res.status(201).send('Incorrect Credentials');
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
      res.status(200).json(result);
    } catch (error) {
      console.log('error before response', error);
      if (error instanceof AppError) {
        res.status(400);
        return;
      }
      next(error);
      return;
    }
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
    res.status(400);
    res.send(err.message);
    return;
  }
  next(err);
};
app.use(errorHandler);

app.use((req: Request, res: Response) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, '0.0.0.0', async () => {
  await createUploadFolder();
  console.log(`Server is listening on port ${PORT}`);
});
