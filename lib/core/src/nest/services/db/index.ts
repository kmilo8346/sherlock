import { HttpException, HttpStatus } from '@nestjs/common';
import { ICollection, ISearchParams } from '@sherlock/core';
import {
  Document,
  Collection,
  Filter,
  MongoClient,
  ObjectId,
  OptionalUnlessRequiredId,
} from 'mongodb';

export abstract class DBService<T extends Document, C, U> {
  protected readonly collectionName: string;
  protected readonly collection: Collection<T>;

  constructor(mongoClient: MongoClient, collectionName: string) {
    this.collectionName = collectionName;
    this.collection = mongoClient.db().collection<T>(collectionName);
  }

  async getById(id: string): Promise<T> {
    const filter = {
      _id: new ObjectId(id),
    } as Filter<T>;

    const data = await this.collection.findOne(filter);

    if (!data) {
      throw new HttpException(
        `Entity (${this.collectionName}) not found`,
        HttpStatus.NOT_FOUND
      );
    }

    return data as T;
  }

  async getAll(params?: ISearchParams): Promise<ICollection<T>> {
    const _params = Object.assign({ from: 0, size: 10 }, params);

    const { query, from, size } = _params;
    const [data, total] = await Promise.all([
      this.collection
        .find(query || {})
        .skip(from)
        .limit(size)
        .toArray(),
      this.collection.countDocuments(query),
    ]);

    return {
      total,
      from,
      size,
      data: data as T[],
    };
  }

  async create(createTopic: C): Promise<T> {
    const data = {
      ...createTopic,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as unknown as T;

    const result = await this.collection.insertOne(
      data as OptionalUnlessRequiredId<T>
    );

    if (result.acknowledged === false) {
      throw new HttpException(
        `Failed to create entity (${this.collectionName})`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return data;
  }

  async update(id: string, updateTopic: U): Promise<void> {
    const data = {
      ...updateTopic,
      updated_at: new Date().toISOString(),
    } as Partial<T>;

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) } as Filter<T>,
      { $set: data }
    );

    if (result.modifiedCount === 0) {
      throw new HttpException(
        `Failed to update entity (${this.collectionName})`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
