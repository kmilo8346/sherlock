import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  BulkInsights,
  CreateInsight,
  Insight,
  UpdateInsight,
} from '@sherlock/models';
import { DBService } from 'apps/api/src/lib';
import {
  AnyBulkWriteOperation,
  DeleteOneModel,
  InsertOneModel,
  MongoClient,
  UpdateOneModel,
} from 'mongodb';

@Injectable()
export class InsightsService extends DBService<
  Insight,
  CreateInsight,
  UpdateInsight
> {
  constructor(@Inject('MONGO_CLIENT') mongoClient: MongoClient) {
    super(mongoClient, 'insights');
  }

  async bulk(bulkInsights: BulkInsights): Promise<void> {
    const result = await this.collection.bulkWrite(
      bulkInsights.operations.map((operation) => {
        switch (operation.type) {
          case 'CREATE':
            return {
              insertOne: {
                document: operation.data,
              },
            };
          case 'UPDATE':
            return {
              updateOne: {
                filter: {
                  _id: this.createId(operation.id),
                },
                update: {
                  $set: operation.data,
                },
              },
            };
          case 'DELETE':
            return {
              deleteOne: {
                filter: {
                  _id: this.createId(operation.id),
                },
              },
            };
        }
      }) as AnyBulkWriteOperation<Insight>[]
    );

    // Validar errores
    if (!result.isOk()) {
      throw new HttpException(
        `Failed to execute bulk insights operation`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
