import { HttpStatus } from "@nestjs/common"
import { ERRORS } from "../constant/errors"
import { Message } from "./ts"

export const messages: Record<number, Message> = {
    [ERRORS.EMAIL_ALREADY_REGISTERED]: {
        status: HttpStatus.BAD_REQUEST,
        translate: {
            es: "Este correo ya esta registrado",
            en: "This email is already registered"
        }
    },
    [ERRORS.USER_NAME_ALREADY_REGISTERED]: {
        translate: {
            es: "Este nombre de usuario ya esta registrado",
            en: "This username is already registered"
        },
        status: HttpStatus.BAD_REQUEST
    },
    [ERRORS.USER_NOT_FOUND]: {
        translate: {
            es: "Usuario no encontrado",
            en: "User not found"
        },
        status: HttpStatus.NOT_FOUND
    },
    [ERRORS.PASSWORD_INCORRECT]: {
        translate: {
            es: "Contraseña incorrecta",
            en: "Password incorrect"
        },
        status: HttpStatus.UNAUTHORIZED
    },
    [ERRORS.USER_INACTIVE]: {
        translate: {
            es: "No tienes acceso al sistema",
            en: "You do not have access to the system"
        },
        status: HttpStatus.UNAUTHORIZED
    },
    [ERRORS.INVALID_TOKEN]: {
        translate: {
            es: "Token invalido o expirado",
            en: "Invalid token or expired"
        },
        status: HttpStatus.UNAUTHORIZED
    },
    [ERRORS.INVALID_SESSION]: {
        translate: {
            es: "Sesión inválida",
            en: "Invalid session"
        },
        status: HttpStatus.UNAUTHORIZED
    },
    [ERRORS.ERROR_UPLOAD_FILE]: {
        translate: {
            es: 'Ocurrió un error al guardar un archivo',
            en: 'An error occurred while saving a file'
        },
        status: HttpStatus.BAD_GATEWAY
    },
    [ERRORS.ERROR_GET_FILE]: {
        translate: {
            es: 'Ocurrió un error al obtener el archivo',
            en: 'An error occurred while getting the file'
        },
        status: HttpStatus.BAD_GATEWAY
    },
    [ERRORS.NOT_ACCESS_RESOURCE]: {
        translate: {
            es: 'No tienes acceso a este recurso',
            en: 'You do not have access to this resource.'
        },
        status: HttpStatus.FORBIDDEN
    }
}
