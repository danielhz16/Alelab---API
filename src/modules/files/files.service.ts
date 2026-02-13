import { Injectable } from "@nestjs/common";
import { MinioService, Lang, RedisClient, handleError, ERRORS } from "@shared";

import { FilesRepository } from "./files.repo";

const FILE_KEY_REDIS = process.env.KEY_FILES_REDIS!
const TTL_FILES = 60 * 60 * 24

@Injectable()
export class FilesService {
    constructor(private readonly minioService: MinioService, private readonly redisClient: RedisClient, private readonly filesRepo: FilesRepository) { }


    private async userAccessFile(filename: string, user: number): Promise<boolean> {
        const fileSearch = this.createTag(filename)
        const key = `${FILE_KEY_REDIS}${fileSearch}`
        const savedUsers: number[] = await this.redisClient.get(key) || [];
        const access = savedUsers.some(id => id == user)


        if (access) return access;

        const refreshUsers = await this.filesRepo.getUsersAccessFile(fileSearch).then(res => res.map(us => us.user_id));

        await this.redisClient.setEx(key, refreshUsers, TTL_FILES)

        return refreshUsers.some(id => id == user)
    }

    async getFile(filename: string, lang: Lang, userId: number) {
        const hasAccess = await this.userAccessFile(filename, userId)

        !hasAccess && handleError({ code: ERRORS.NOT_ACCESS_RESOURCE, lang })

        return this.minioService.getFile(filename, lang);
    }

    createTag(filename: string): string {
        return `[FILE_${filename}]`;
    }

    getContentWithUrl(content: string): string {
        const { HOST, PORT, PROTOCOL } = process.env
        const regexTagFile = /\[FILE_([^\]]+)\]/g

        return content.replace(
            regexTagFile,
            `${PROTOCOL}://${HOST}:${PORT}/files/file/$1`
        )
    }

}