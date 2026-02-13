import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NotesRepository } from './notes.repo';
import { AuthModule } from '../auth/auth.module';
import { MinioService } from 'src/shared/services/minio.service';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [AuthModule, FilesModule],
  controllers: [NotesController],
  providers: [NotesService, NotesRepository, MinioService],
  exports: [NotesService],
})
export class NotesModule { }