
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { validateToken } from 'src/helpers/auth.helpers';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    validateToken({ req, next, secretKey: process.env.JWT_ADMIN_SECRET_KEY });
  }
}