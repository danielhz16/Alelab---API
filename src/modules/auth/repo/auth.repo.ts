import { Injectable } from "@nestjs/common";
import { mainRepo } from "src/db/db.repo";
import { BaseRepository } from "mrepo-sql";
import { ResponseBd } from "@shared";
import { LoginOutput } from "../ts";

@Injectable()
export class AuthRepository {
    private bd: BaseRepository;
    constructor() {
        this.bd = mainRepo;
    }
    async create(params: [string, string]) {
        return await this.bd.execSP<ResponseBd>('SP_Users_Create', {
            params,
            out: [{ name: 'code' }, { name: 'id' }]
        });
    }

    async validateEmail(email: string) {
        return await this.bd.execSP<ResponseBd>('SP_Users_VerifyEmail', {
            params: [email],
            out: [{ name: 'code' }]
        });
    }

    async login(user: string, isEmail: number): Promise<LoginOutput> {
        return await this.bd.execSP('SP_Users_Login', {
            params: [user, isEmail],
            out: [{ name: 'errorCode' }, { name: 'id' }, { name: 'name' }, { name: 'email' }, { name: 'hash' }]
        });
    }

    async getUserById(id: number): Promise<{ name: string; email: string }> {
        return await this.bd.execSP('SP_Users_GetById', {
            params: [id],
            out: [{ name: 'name' }, { name: 'email' }]
        });
    }
}

