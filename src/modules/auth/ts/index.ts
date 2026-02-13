export interface LoginOutput {
    id: number;
    email: string;
    errorCode: number;
    name?: string | null;
    hash?: string;
}