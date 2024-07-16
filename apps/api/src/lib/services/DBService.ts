import { HttpException, HttpStatus } from '@nestjs/common';
import { ICollection, SearchParams } from '@sherlock/models';
import {
  Document,
  Collection,
  Filter,
  MongoClient,
  ObjectId,
  OptionalUnlessRequiredId,
  Sort,
  SortDirection,
} from 'mongodb';

export abstract class DBService<T extends Document, C, U> {
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
    const _params: SearchParams = Object.assign(
      { filter: {}, from: 0, size: 10, sort: undefined },
      params
    );

    const { filter, from, size, sort } = _params;
    const [data, total] = await Promise.all([
      this.collection
        .find(filter)
        .skip(from)
        .limit(size)
        .sort(sort as { [key: string]: SortDirection })
        .toArray(),
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
   * @param createDocument
   * @returns {Promise<T>}
   */
  async create(createDocument: C): Promise<T> {
    const data = {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...createDocument,
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
   * Crea varios documentos en la colección
   * @param createDocuments
   */
  async createMany(createDocuments: C[]) {
    const data = createDocuments.map((document) => ({
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...document,
    }));

    const result = await this.collection.insertMany(
      data as OptionalUnlessRequiredId<T>[]
    );

    if (result.acknowledged === false) {
      throw new HttpException(
        `Failed to create documents`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Actualiza un documento en la colección
   * @param id
   * @param updateTopic
   */
  async update(id: string, updateTopic: U): Promise<void> {
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
