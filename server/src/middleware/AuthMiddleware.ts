import { RequestHandler } from 'express';

export const isRequestAuthenticated: RequestHandler = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  next();
};
