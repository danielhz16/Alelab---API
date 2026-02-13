import { ERRORS } from './../constant/errors';
import { handleError } from './handle-errors'
import type { Lang } from '../ts/types';


export const NoAccessResource = (lang: Lang) => {
    handleError({ code: ERRORS.NOT_ACCESS_RESOURCE, lang });
}


