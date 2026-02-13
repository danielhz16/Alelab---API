import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Lang as LangType } from '../ts/types';

export const Lang = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const lang = req.lang;
    return lang as LangType || 'es';
  },
);
