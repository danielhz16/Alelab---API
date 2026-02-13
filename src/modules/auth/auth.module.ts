import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { AuthRepository } from './repo/auth.repo';
import { PasswordHelper } from './helpers/password';
import { TokenHelper } from './services/session.service';
import { RedisClient, EmailAdapter } from '@shared';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthRepository,
        PasswordHelper,
        TokenHelper,
        RedisClient,
        EmailAdapter,
    ],
    exports: [AuthService, TokenHelper],
})
export class AuthModule { }
