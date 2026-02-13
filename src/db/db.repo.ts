import { BaseRepository } from "mrepo-sql";
import { mainDB } from "./config";


export const mainRepo = new BaseRepository(mainDB);