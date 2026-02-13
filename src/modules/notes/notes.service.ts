import { NotesRepository } from "./notes.repo";
import { Injectable } from "@nestjs/common";
import { NoteCreateIn, NoteOutput } from "./ts";
import { ResponseRefresh, MinioService, Lang, NoAccessResource } from "@shared";
import { FilesService } from "../files/files.service";

@Injectable()
export class NotesService {
    constructor(
        private readonly notesRepo: NotesRepository,
        private readonly minioService: MinioService,
        private readonly filesService: FilesService,
    ) { }

    private async processImages(content: string, files: Express.Multer.File[], lang: Lang): Promise<{ processedContent: string, filesInserted: string }> {
        let processedContent = content;
        const filesInserted: string[] = [];


        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const placeholder = `[IMAGE_${i}]`;
                if (processedContent.includes(placeholder)) {
                    const minioUrl = await this.minioService.uploadFile(files[i], undefined, lang);
                    const savedUrl = this.filesService.createTag(minioUrl!);
                    filesInserted.push(savedUrl);
                    processedContent = processedContent.replace(placeholder, savedUrl);
                }
            }
        }

        const imgRegex = /<img[^>]+src="(data:image\/[^;]+;base64,[^"]+)"[^>]*>/g;
        const matches = [...processedContent.matchAll(imgRegex)];


        for (const match of matches) {
            const base64Data = match[1];
            const minioUrl = await this.minioService.uploadBase64Image(base64Data, lang);
            const savedUrl = this.filesService.createTag(minioUrl!);
            filesInserted.push(savedUrl);
            processedContent = processedContent.replace(base64Data, savedUrl);
        }

        return {
            processedContent, filesInserted: JSON.stringify(filesInserted)
        };
    }

    async createNote(note: NoteCreateIn, images: Express.Multer.File[], userId: number, lang: Lang): Promise<ResponseRefresh> {
        const { title, content, courseId } = note;

        const { processedContent, filesInserted } = await this.processImages(content, images, lang);
        const { dateCreated, noteId } = await this.notesRepo.createNote([title, processedContent, userId, courseId, filesInserted]);
        return {
            newData: { noteId, dateCreated, ...note, content: processedContent }
        }
    }
    async getNotesByUserId(userId: number, lang: Lang): Promise<NoteOutput[]> {
        const notes = await this.notesRepo.getNotesByUserId(userId);
        const processedNotes = notes.map(note => {
            return {
                ...note,
                content: this.filesService.getContentWithUrl(note.content)
            }
        });
        return processedNotes;

    }
    async updateNote(note: NoteCreateIn, images: Express.Multer.File[], noteId: number, userId: number, lang: Lang): Promise<ResponseRefresh> {
        const { title, content, courseId } = note;

        const { processedContent, filesInserted } = await this.processImages(content, images, lang);
        const data = await this.notesRepo.updateNote([title, processedContent, courseId, noteId, userId, filesInserted]);

        return {
            newData: { ...{ noteId }, ...data, ...note, content: processedContent }
        }
    }

    async getNoteById(userId: number, noteId: number, lang: Lang): Promise<NoteOutput> {
        const note = await this.notesRepo.getNoteById(userId, noteId, () => NoAccessResource(lang));
        const content = this.filesService.getContentWithUrl(note?.content);

        return {
            ...note,
            content
        };
    }
}
