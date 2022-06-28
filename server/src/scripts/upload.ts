import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';
import { AppError } from './error';

export const createUploadFolder = async () => {
  try {
    await fs.access(path.join(__dirname + '/../uploads'));
  } catch (error) {
    await fs.mkdir(path.join(__dirname + '/../uploads'));
  }
};
export const verifyImageUrl = (imageUrl: string) => {
  console.log('verifying url ......');
  const url = new URL(imageUrl);
  return new Promise((resolve, reject) => {
    if (url.protocol === 'https:') {
      const request = https.request(url, (res) => {
        resolve(res.headers['content-type']?.includes('image'));
      });
      request.on('error', (err) => {
        console.log('Error ');
        reject(new AppError(err.message));
      });
      request.end();
    } else if (url.protocol === 'http:') {
      const request = http.request(url, (res) => {
        resolve(res.headers['content-type']?.includes('image'));
      });
      request.on('error', (err) => {
        console.log('Error ');
        reject(new AppError(err.message));
      });
      request.end();
    } else {
      reject(new AppError('Invalid image url'));
    }
  });
};
