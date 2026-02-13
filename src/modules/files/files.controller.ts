import { Controller, Get, Param, StreamableFile } from "@nestjs/common";
import { FilesService } from "./files.service";
import { Lang, User } from "@shared";


@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Get('file/*filename')
    async getImage(
        @Param('filename') filename: string | string[],
        @Lang() lang,
        @User('id') idUser: number) {
        const path = Array.isArray(filename) ? filename.join('/') : filename;
        const file = await this.filesService.getFile(path, lang, idUser);
        return new StreamableFile(file);
    }
}