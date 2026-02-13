
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpMiddleware implements NestMiddleware {
  use(req: Request & { ipAddress?: string }, res: Response, next: NextFunction) {
    const forwarded = req.headers['x-forwarded-for'];
    req.ipAddress = Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded?.split(',')[0] || req.socket.remoteAddress;

    next();
  }
}
