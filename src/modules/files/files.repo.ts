import { mainRepo } from "src/db/db.repo";
import { BaseRepository } from "mrepo-sql";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FilesRepository {
    private bd: BaseRepository;
    constructor() {
        this.bd = mainRepo;
    }

    async getUsersAccessFile(filename: string): Promise<{ user_id: number }[]> {
        return await this.bd.execSP('SP_Files_GetUsersAccess', {
            params: [filename],
            plain: false
        });
    }
}
