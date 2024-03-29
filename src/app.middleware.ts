import { HttpStatus } from '@nestjs/common';
import { NextFunction, Request, Response, Handler } from 'express';
import * as jwt from 'jsonwebtoken';

/**
 * validator function validate the jsonwebtoken
 * for the simplicity of this application
 * the secret is set as constant
 *
 * @returns
 */
export function validator(): Handler {
  return function (req: Request, res: Response, next: NextFunction) {
    const urlPath = req.path;

    if (
      urlPath.includes('/docs') ||
      urlPath.includes('/login') ||
      urlPath.includes('/register')
    ) {
      next();
      return;
    }

    const secret = 'mysecret'; // TODO: replace with real secret key
    const token = req.cookies['token'];
    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED);
      res.end();
      return;
    }

    const result = jwt.verify(token, secret);
    if (!result) {
      res.status(HttpStatus.UNAUTHORIZED);
      res.end();
      return;
    }

    next();
  };
}
