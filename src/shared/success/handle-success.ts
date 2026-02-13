import { successMessages } from "./messages";



export const handleSuccess = (code: number, lang: string = 'es') => {
    const message = successMessages[code];
    return message?.translate[lang]; 
}