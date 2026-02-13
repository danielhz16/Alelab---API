// Adapters
export * from './adapters/email';

// Clients
export * from './clients/redis';

// Constants
export * from './constant/errors';
export * from './constant/success';
export * from './constant/http';

// Decorators
import { Lang as LangDecorator } from './decorators/lang.decorator';
import { User as UserDecorator } from './decorators/user.decorator';
export { LangDecorator, UserDecorator };
export * from './decorators/public.decorator';

// Success Handling
export * from './success/messages';
export * from './success/handle-success';

// Error Handling
export * from './error/messages';
export * from './error/handle-errors';
export * from './error/commonErrors';

// Guards
export * from './guards/auth/isAuth';
export * from './guards/general/ip';
export * from './guards/general/lang';
export * from './guards/general/logger';
export * from './guards/limiter/ip-limeter';
export * from './guards/limiter/login-limiter';

// Services
export * from './services/minio.service';

// Types and Interfaces
import type { Lang as LangType } from './ts/types/index';
import type { User as UserInterface } from './ts/interfaces/user';
export type { LangType, UserInterface };
export * from './ts/interfaces/index';

// Unified Lang and User exports
export const Lang = LangDecorator;
export type Lang = LangType;

export const User = UserDecorator;
export type User = UserInterface;
