import { Injectable } from '@nestjs/common';
import { RedisClient, Session, UserProfile, handleError, ERRORS, Lang } from "@shared";
import crypto from 'crypto';
import { AuthRepository } from '../repo/auth.repo';

const SESSION_TTL = 8 * 60 * 60;
const CONTEXT_TTL = 15 * 60;

const KEY_SESSION = process.env.KEY_SESSION!;
const KEY_USER_SESSIONS = process.env.KEY_USER_SESSIONS!;
const KEY_USER_CONTEXT = process.env.KEY_USER_CONTEXT!;

@Injectable()
export class TokenHelper {
    constructor(
        private readonly redis: RedisClient,
        private readonly auth: AuthRepository
    ) { }


    private sessionKey(sid: string): string {
        return `${KEY_SESSION}${sid}`;
    }


    private userSessionsKey(userId: number): string {
        return `${KEY_USER_SESSIONS}${userId}`;
    }


    private userContextKey(userId: number): string {
        return `${KEY_USER_CONTEXT}${userId}`;
    }

    private async saveContextUser(userId: number, user: UserProfile) {
        await this.redis.setEx(
            this.userContextKey(userId),
            user,
            CONTEXT_TTL
        );
    }

    async saveSession(user: UserProfile, ip: string): Promise<string> {
        const sid = crypto.randomUUID();

        const payload: Session = {
            userId: user.id,
            ip,
            timeStamp: new Date().toISOString(),
        };

        // Sesión
        await this.redis.setEx(
            this.sessionKey(sid),
            payload,
            SESSION_TTL
        );

        // Índice de sesiones
        await this.redis.client.sAdd(
            this.userSessionsKey(user.id),
            sid
        );

        // Context 
        await this.saveContextUser(user.id, user);

        return sid;
    }

    async validateSession(
        sid: string,
        ip: string,
        lang: Lang
    ): Promise<UserProfile | null> {
        if (!sid) return null;

        const session: Session | null = await this.redis.get(
            this.sessionKey(sid)
        );
        if (!session) return null;

        if (session.ip !== ip) {
            await this.invalidateSession(session.userId, sid);
            return null;
        }


        let user: UserProfile | null = await this.redis.get(
            this.userContextKey(session.userId)
        );


        if (!user) {
            const dataUser = await this.auth.getUserById(session.userId)
            user = {
                id: session.userId,
                ...dataUser
            };

            !user && handleError({ code: ERRORS.USER_INACTIVE, lang: lang });

            await this.saveContextUser(session.userId, user);
        }

        return user;
    }

    async invalidateSession(userId: number, sid: string): Promise<void> {
        await this.redis.del(this.sessionKey(sid));
        await this.redis.client.sRem(
            this.userSessionsKey(userId),
            sid
        );
    }

    async invalidateAllSessions(userId: number): Promise<void> {
        const sids = await this.redis.client.sMembers(
            this.userSessionsKey(userId)
        );

        for (const sid of sids) {
            await this.redis.del(this.sessionKey(sid));
        }

        await this.redis.del(this.userSessionsKey(userId));
        await this.redis.del(this.userContextKey(userId));
    }
}
