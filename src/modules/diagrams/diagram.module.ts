import { Module } from '@nestjs/common';
import { DiagramController } from './diagram.controller';
import { DiagramRepo } from './diagram.repo';
import { DiagramService } from './diagram.service';

@Module({
    controllers: [DiagramController],
    providers: [DiagramRepo, DiagramService],
    exports: [DiagramService],
})
export class DiagramsModule { }
