import path from 'node:path';
import { URL } from 'node:url';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import Formidable, { File } from 'formidable';
import { IUpdateUserDetails } from '../types/types';
import { AppError } from '../scripts/error';
import { verifyImageUrl } from '../scripts/upload';

const handleNoFile = async (
  next: NextFunction,
  res: Response,
  req: Request,
  fields: Formidable.Fields
) => {
  if (!req.user) {
    throw new AppError('No user session');
  }
  const userFields = fields as Record<keyof IUpdateUserDetails, string>;
  console.log(userFields);

  if (userFields.picture?.length === 0) {
    const userObj: IUpdateUserDetails = {
      ...userFields,
      user_id: req.user?.user_id,
    };
    res.locals.user = userObj;
    next();
    return;
  }
  try {
    const isImageUrlValid = await verifyImageUrl(userFields.picture);
    console.log('is image valid', isImageUrlValid);
    if (!isImageUrlValid) throw new AppError('Image url is invalid');
    const userObj: IUpdateUserDetails = {
      ...userFields,
      user_id: req.user?.user_id,
    };
    res.locals.user = userObj;
    next();
    return;
  } catch (error) {
    next(error);
  }
};

export const handleFormData: RequestHandler = async (req, res, next) => {
  try {
    let isFileValid = true;
    const form = Formidable({
      allowEmptyFiles: false,
      uploadDir: path.join(__dirname, '/../uploads'),
      keepExtensions: true,
      filter: ({ mimetype }) => {
        isFileValid = mimetype && mimetype.includes('image') ? true : false;
        return mimetype && mimetype.includes('image') ? true : false;
      },
    });

    form.parse(req, async (err, fields, file) => {
      try {
        if (!req.user) {
          throw new AppError('No user session');
        }

        if (!isFileValid) {
          console.log('not valid file');
          const err = new AppError('File is not valid');
          next(err);
          return;
        }
        if (err) {
          next(err);
          return;
        }
        const userFields = fields as Record<keyof IUpdateUserDetails, string>;
        if (Object.entries(file).length === 0) {
          await handleNoFile(next, res, req, fields);
          return;
        }
        const { newFilename } = file?.picture as File;
        const fileUrl = new URL(
          `/${newFilename}`,
          `${req.protocol}://${req.get('host')}/uploads`
        );

        const userObjWithFileUrl: IUpdateUserDetails = {
          ...userFields,
          user_id: req.user?.user_id,
          picture: fileUrl.href,
        };
        console.log(userObjWithFileUrl);

        res.locals.user = userObjWithFileUrl;

        next();
      } catch (error) {
        throw error;
      }
    });
    form.once('error', (err) => {
      console.error('An error occurred while parsing form data ', err);
      next(err);
    });
  } catch (error) {
    console.log('the error was caught');
    next(error);
  }
};
