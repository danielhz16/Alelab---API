import { handleError, RedisClient, EmailAdapter, ERRORS, handleSuccess, SUCCESS, Lang } from "@shared";
import type { UserInterface } from "@shared";
import { AuthRepository } from "../repo/auth.repo";
import { Injectable } from "@nestjs/common";
import { PasswordHelper } from "../helpers/password";
import { TokenHelper } from "./session.service";

const KEY_TEMP_TOKEN = 'temp-token:';

@Injectable()
export class AuthService {
    constructor(
        private readonly auth: AuthRepository,
        private readonly pass: PasswordHelper,
        private readonly redis: RedisClient,
        private readonly email: EmailAdapter,
        private readonly token: TokenHelper
    ) {
    }

    private isEmail(email: string) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    async validateEmail(email: string, lang: Lang) {
        const { code } = await this.auth.validateEmail(email);
        handleError({ code, lang });
    }

    async sendTempToken(email: string, lang: Lang) {
        await this.validateEmail(email, lang);
        const token = await this.pass.createTempToken();
        await this.redis.setEx(`${KEY_TEMP_TOKEN}${email}`, token, 60 * 60);
        await this.email.sendMail(email, 'Temp Token', `Tu token temporal es: ${token}`);
        return {
            show: handleSuccess(SUCCESS.SEND_CODE_EMAIL, lang)
        };
    }

    async verifyTempToken(email: string, token: string) {
        const redisToken = await this.redis.get(`${KEY_TEMP_TOKEN}${email}`);
        const isValid = redisToken == token;

        if (isValid) {
            await this.redis.del(`${KEY_TEMP_TOKEN}${email}`);
        }

        return isValid;
    }

    async createUser(user: UserInterface, lang: Lang, ip: string) {
        await this.validateEmail(user.email, lang);
        const isValidToken = await this.verifyTempToken(user.email, user.tempToken!);

        if (!isValidToken) {
            handleError({ code: ERRORS.INVALID_TOKEN, lang });
        }
        const password = await this.pass.encryptPassword(user.password!);


        const { code, id } = await this.auth.create([
            user.email, 
            password
        ]);

        handleError({ code, lang });

        const session = await this.token.saveSession({ 
            id, name: null, 
            email: user.email 
            }, ip);


        return { session, id };
    }

    async login(user: string, password: string, lang: Lang, ip: string) {
        const isEmail = this.isEmail(user);
        const { errorCode, name, id, email, hash } = await this.auth.login(
            user,
            isEmail ? 1 : 0
        );

        handleError({ code: errorCode, lang });

        if (!await this.pass.comparePassword(password, hash!)) {
            handleError({ code: ERRORS.PASSWORD_INCORRECT, lang });
        }

        const session = await this.token.saveSession({ 
            id, 
            name: name ?? null, 
            email 
           }, ip);

        return { name, session, id };
    }

}