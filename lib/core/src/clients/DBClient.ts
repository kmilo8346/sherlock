import { HttpException, HttpStatus } from '@nestjs/common';
import { ICollection, SearchParams } from '@sherlock/models';
import {
  Document,
  Collection,
  Filter,
  MongoClient,
  ObjectId,
  OptionalUnlessRequiredId,
} from 'mongodb';

export abstract class DBClient<T extends Document> {
  protected readonly collectionName: string;
  protected readonly collection: Collection<T>;

  constructor(mongoClient: MongoClient, collectionName: string) {
    this.collectionName = collectionName;
    this.collection = mongoClient.db().collection<T>(collectionName);
  }

  /**
   * Obtiene un documento por su id
   * La función lanza una excepción si no se encuentra el documento
   * @param id
   * @returns {Promise<T>}
   */
  async getById(id: string): Promise<T> {
    const filter = {
      _id: this.createId(id),
    } as Filter<T>;

    const data = await this.collection.findOne(filter);

    if (data === null) {
      throw new HttpException(`Document not found`, HttpStatus.NOT_FOUND);
    }

    return data as T;
  }

  /**
   * Obtiene todos los documentos de la colección
   * filtrados por los parámetros de búsqueda
   * @param params
   * @returns {Promise<ICollection<T>>}
   */
  async getAll(params?: SearchParams): Promise<ICollection<T>> {
    const _params = Object.assign({ filter: {}, from: 0, size: 10 }, params);

    const { filter, from, size } = _params;
    const [data, total] = await Promise.all([
      this.collection.find(filter).skip(from).limit(size).toArray(),
      this.collection.countDocuments(filter),
    ]);

    return {
      total,
      from,
      size,
      data: data as T[],
    };
  }

  /**
   * Crear un nuevo documento en la colección
   * @param createTopic
   * @returns {Promise<T>}
   */
  async create<C>(createTopic: C): Promise<T> {
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
        `Failed to create document`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return data;
  }

  /**
   * Actualiza un documento en la colección
   * @param id
   * @param updateTopic
   */
  async update<U>(id: string, updateTopic: U): Promise<void> {
    const data = {
      ...updateTopic,
      updated_at: new Date().toISOString(),
    } as Partial<T>;

    const result = await this.collection.updateOne(
      { _id: this.createId(id) } as Filter<T>,
      { $set: data }
    );

    if (result.modifiedCount === 0) {
      throw new HttpException(
        `Failed to update document`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Elimina un documento de la colección
   * @param id
   */
  async delete(id: string): Promise<void> {
    const result = await this.collection.deleteOne({
      _id: this.createId(id),
    } as Filter<T>);

    if (result.deletedCount === 0) {
      throw new HttpException(
        `Failed to delete document`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private createId(id: string): string | ObjectId {
    return id.length !== 24 ? id : new ObjectId(id);
  }
}
