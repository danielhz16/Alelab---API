import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { TokenHelper } from 'src/modules/auth/services/session.service';
import { ERRORS } from '../../constant/errors';
import { handleError } from '../../error/handle-errors';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';

@Injectable()
export class IsAuthGuard implements CanActivate {
  constructor(
    private readonly sessions: TokenHelper,
    private reflector: Reflector
  ) { }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest<Request>();
    const lang = req['lang'] ?? req.headers['x-lang'] ?? 'es';


    const sid = req.cookies?.sid;

    if (!sid) {
      throw new UnauthorizedException('No autenticado');
    }

    const session = await this.sessions.validateSession(sid, req['ipAddress'], lang);
    if (!session) {
      handleError({ code: ERRORS.INVALID_SESSION, lang: req['lang'] });
    }


    req['user'] = session;

    return true;
  }
}
