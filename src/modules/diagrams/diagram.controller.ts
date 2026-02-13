import { Body, Controller, Get, Post } from "@nestjs/common";
import { DiagramService } from "./diagram.service";
import { User } from "@shared/decorators/user.decorator";

@Controller("diagrams")
export class DiagramController {
    constructor(private readonly service: DiagramService){};

    @Get() 
    async list(
        @User('id') userId
    ) {
     return this.service.list(userId)
    }

    @Post('create')
    async create(
        @Body() b, 
        @User('id') user
    ) {
      return this.service.create({...b, user})
    }

}

