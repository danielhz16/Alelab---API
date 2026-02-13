
import {
  Injectable,
  OnModuleInit,
  BeforeApplicationShutdown,
  Logger,
} from '@nestjs/common';

import { mainRepo } from './db/db.repo';

@Injectable()
export class AppLifecycle
  implements OnModuleInit, BeforeApplicationShutdown {
  private readonly logger = new Logger(AppLifecycle.name);
  async onModuleInit() {
    this.logger.log('Inicializando recursos...');

    await mainRepo.connectDB(() =>
      this.logger.log('DB conectada'),
    );
  }

  async beforeApplicationShutdown(signal: string) {
    this.logger.warn(`Apagando app (${signal})`);

    await mainRepo.closeDB();
    this.logger.log('DB cerrada');
  }
}
