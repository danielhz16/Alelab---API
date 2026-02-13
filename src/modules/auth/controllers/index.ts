import { AuthService } from "../services";
import { Controller, Post, Body, Request as Req, Response as Res, UseGuards } from "@nestjs/common";
import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { Public, LoginLimiterGuard } from "@shared";
import type { UserInterface } from "@shared";


@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) { }

    @Public()
    @Post('register')
    async register(
        @Body() user: UserInterface,
        @Req() req: ExpressRequest & { ipAddress: string },
        @Res({ passthrough: true }) res: ExpressResponse) {
        const { session, id } = await this.auth.createUser(user, req['lang'], req.ipAddress);
        res.cookie('sid', session, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000,
            path: '/',
        });
        return { user: { name: null, id, logged: true } };
    }

    @UseGuards(LoginLimiterGuard)
    @Public()
    @Post('send-code')
    async sendCode(@Body('email') email: string, @Req() req: ExpressRequest) {
        return this.auth.sendTempToken(email, req['lang']);
    }

    @UseGuards(LoginLimiterGuard)
    @Public()
    @Post('login')
    async login(
        @Body() user: { user: string; password: string },
        @Req() req: ExpressRequest & { ipAddress: string },
        @Res({ passthrough: true }) res: ExpressResponse
    ) {
        const { session, name, id } = await this.auth.login(
            user.user,
            user.password!,
            req['lang'],
            req.ipAddress
        );



        res.cookie('sid', session, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 8 * 60 * 60 * 1000,
            path: '/',
        });

        return { user: { name, id, logged: true } };
    }
}
