import { SUCCESS } from './../constant/success';
import { SuccessMessage } from "./ts";

export const successMessages: Record<number, SuccessMessage> = {
    [SUCCESS.SEND_CODE_EMAIL]: {
        translate: {
            es: 'Se envío un token a tu correo electrónico',
            en: 'A token was sent to your email'
        }
    }
}