import { NotesService } from "./notes.service";
import { Controller, Get, Post, Body, Req, Injectable, Param, Put, UseInterceptors, UploadedFiles } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { User, Lang, ResponseRefresh } from "@shared";

import type { NoteCreateIn } from "./ts";

@Controller('notes')
@Injectable()
export class NotesController {
    constructor(
        private readonly notesService: NotesService
    ) { }

    @Post('create')
    @UseInterceptors(FilesInterceptor('images'))
    async createNote(
        @Body() note: NoteCreateIn,
        @UploadedFiles() images: Express.Multer.File[],
        @User('id') userId: number,
        @Lang() lang: Lang
    ): Promise<ResponseRefresh> {
        return await this.notesService.createNote(note, images, userId, lang);
    }

    @Get('my-notes')
    async getMyNotes(
        @User('id') userId: number,
        @Lang() lang: Lang
    ): Promise<import("/home/daniel/Escritorio/NOTAS-U/API/api/src/modules/notes/ts/index").NoteOutput[]> {
        return await this.notesService.getNotesByUserId(userId, lang);
    }
    @Put('update/:id')
    @UseInterceptors(FilesInterceptor('images'))
    async updateNote(
        @Body() note: NoteCreateIn,
        @UploadedFiles() images: Express.Multer.File[],
        @User('id') userId: number,
        @Param('id') noteId: number,
        @Lang() lang: Lang
    ): Promise<ResponseRefresh> {
        return await this.notesService.updateNote(note, images, noteId, userId, lang);
    }
    @Get('get/:noteId')
    async getNoteById(
        @User('id') userId: number,
        @Param('noteId') noteId: number,
        @Lang() lang: Lang
    ) {
        return await this.notesService.getNoteById(userId, noteId, lang);
    }
}