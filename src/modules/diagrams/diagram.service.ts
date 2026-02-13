import { DiagramRepo } from "./diagram.repo";
import { Injectable } from "@nestjs/common";
import { Diagram, DiagramBody, DiagramCreate } from "./ts";
import { ResponseRefresh } from "@shared/index";

@Injectable() 
export class DiagramService {
   constructor (
      private readonly diagrams: DiagramRepo
   ) {}

   async create(body: DiagramBody): Promise <ResponseRefresh> {
    const { user, name, course, nodes, edges } = body;
    const created = this.diagrams.create([user, name, course, nodes, edges])
    return {
        newData: {...created, ...body}
    }
   }

   async list(user: number): Promise <Diagram[]> {
    return this.diagrams.listDiagrams(user)
   }

} 