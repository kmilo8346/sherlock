import { Module, Global, OnModuleInit, Logger } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import * as colors from 'ansi-colors';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'MONGO_CLIENT',
      useFactory: async (
        configService: ConfigService
      ): Promise<MongoClient> => {
        const client = new MongoClient(configService.get('MONGODB_URI'));
        return await client.connect();
      },
      inject: [ConfigService],
    },
  ],
  exports: ['MONGO_CLIENT'],
})
export class MongoModule implements OnModuleInit {
  private readonly logger: Logger;

  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger('MongoDBModule');
  }

  async onModuleInit() {
    const startAt = process.hrtime();
    const stamp = () => {
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      return colors.yellow(`+${Math.round(responseTime)}ms`);
    };

    const client = new MongoClient(this.configService.get('MONGODB_URI'));
    try {
      await client.connect();
      const db = client.db();
      const admin = db.admin();
      await admin.ping();
      this.logger.log(`Connection to MongoDB was sucesfull ${stamp()}`);
    } catch (error) {
      this.logger.error(`Connection [FAILURE] ${stamp()}`, error);
      this.logger.error('Exiting application...');
      process.exit(1);
    } finally {
      await client.close();
    }
  }
}
