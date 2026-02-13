export interface ResponseBd {
    code: number;
    id: number;
}

export interface ResponseDbCrate {
    id: number,
    dateCreated: Date,
}

export interface ResponseBdUpdate {
    id: number,
    dateUpdate: Date
}

export interface ResponseRefresh {
    newData: object;
}

export interface Options {
    label: string;
    id: number;
}

export * from './user';