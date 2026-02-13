
export interface NoteCreateIn {
    title: string;
    content: string;
    courseId?: number;
}

export interface NoteOutput extends NoteCreateIn {
    noteId: number;
    dateCreated: string;
    dateEdited: string;
    courseName?: string;
}

export type NoteCreate = [
    NoteCreateIn['title'],
    NoteCreateIn['content'],
    number,
    NoteCreateIn['courseId'],
    string
]; // title, content, userId

export type NoteUpdate = [
    NoteCreateIn['title'],
    NoteCreateIn['content'],
    NoteCreateIn['courseId'],
    number,
    number,
    string
]; // title, content, userId


