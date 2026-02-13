import { BaseRepository } from "mrepo-sql";
import { mainRepo } from "src/db/db.repo";
import { Injectable } from "@nestjs/common";
import { DiagramCreate, Diagram } from "./ts";
import { ResponseDbCrate } from "@shared/index";

@Injectable() 
export class DiagramRepo {
    private bd: BaseRepository;
    constructor() {
        this.bd = mainRepo
    }
 
    async create (params: DiagramCreate): Promise<ResponseDbCrate> {
        return this.bd.execSP('SP_Diagrams_Create', {
            params
        }) 
    }

    async listDiagrams (user: number): Promise<Diagram []>{
        return this.bd.execSP('SP_Diagrams_List', {
            params: [user],
            plain: false
        })
    }
}