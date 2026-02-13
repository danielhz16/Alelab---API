import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MinioService, RedisClient } from "@shared";
import { FilesRepository } from './files.repo';

@Module({
    controllers: [FilesController],
    providers: [FilesService, MinioService, RedisClient, FilesRepository],
    exports: [FilesService],
})
export class FilesModule { }
