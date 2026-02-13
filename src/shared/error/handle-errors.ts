import { HttpException, HttpStatus } from "@nestjs/common";
import { messages } from "./messages";
import type { Lang } from "../ts/types";

interface HandleError {
    code: number;
    lang: Lang;
}

export const handleError = ({
    code,
    lang
}: HandleError) => {
    if(!code || code == 0) return;

    const error = messages[code];
    
    const status = error.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.translate[lang ?? 'es'] ;
    throw new HttpException(message, status);
}
