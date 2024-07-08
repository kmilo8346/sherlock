import { Module, Global, OnModuleInit, Logger } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import * as colors from 'ansi-colors';

const LOGGER_CONTEXT = 'MongodbModule';
const MONGODB_URI =
  'mongodb://root:root@localhost:27017/sherlock?authSource=admin';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: 'MONGO_CLIENT',
      useFactory: async (): Promise<MongoClient> => {
        const client = new MongoClient(MONGODB_URI);
        return await client.connect();
      },
    },
  ],
  exports: ['MONGO_CLIENT'],
})
export class MongoModule implements OnModuleInit {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(LOGGER_CONTEXT);
  }

  async onModuleInit() {
    const startAt = process.hrtime();
    const stamp = () => {
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      return colors.yellow(`+${Math.round(responseTime)}ms`);
    };

    const client = new MongoClient(MONGODB_URI);
    try {
      this.logger.log(`Connecting to MongoDB...`);
      await client.connect();
      const db = client.db();
      const admin = db.admin();
      await admin.ping();
      this.logger.log(`Connection sucesfull ${stamp()}`);
    } catch (error) {
      this.logger.error(`Connection [FAILURE] ${stamp()}`, error);
      this.logger.error('Exiting application...');
      process.exit(1);
    } finally {
      await client.close();
    }
  }
}
