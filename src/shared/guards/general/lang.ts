import { Injectable } from "@nestjs/common";
import { NextFunction } from "express";
import { Request, Response } from "express";

@Injectable()
export class LangMiddleware {
    constructor() {
    }

    use(req: Request, res: Response, next: NextFunction) {
        req['lang'] = (req.headers['x-language'] as string) || 'es';
        next();
    }
}