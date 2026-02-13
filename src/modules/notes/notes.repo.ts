import { mainRepo } from "src/db/db.repo";
import { BaseRepository } from "mrepo-sql";
import { Injectable } from "@nestjs/common";
import { NoteCreate, NoteOutput, NoteUpdate } from "./ts";


@Injectable()
export class NotesRepository {
    private bd: BaseRepository;
    constructor() {
        this.bd = mainRepo;
    }

    async createNote(params: NoteCreate): Promise<NoteOutput> {
        return await this.bd.execSP('SP_Notes_Create', {
            params,
            out: [{ name: 'noteId' }, { name: 'dateCreated' }]
        });
    }

    async getNotesByUserId(userId: number): Promise<NoteOutput[]> {
        return await this.bd.execSP('SP_Notes_List', {
            params: [userId],
            plain: false,
        });
    }

    async updateNote(params: NoteUpdate): Promise<NoteOutput> {
        return await this.bd.execSP('SP_Notes_Update', {
            params,
            out: [{ name: 'dateEdited' }, { name: 'courseName' }]
        });
    }

    async getNoteById(userId: number, noteId: number, onNotData: () => void): Promise<NoteOutput> {
        return await this.bd.execSP('SP_Notes_Get', {
            params: [userId, noteId],
            onNotData: onNotData
        });
    }
}

