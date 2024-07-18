import crypto from 'crypto';
import { dot, norm } from 'mathjs';
import path from 'path';
import fs from 'fs';
import os from 'os';

export class Util {
  cosineDistance(embedding1: number[], embedding2: number[]): number {
    const dotProduct = dot(embedding1, embedding2);
    const normA = norm(embedding1) as number;
    const normB = norm(embedding2) as number;
    return 1 - dotProduct / (normA * normB);
  }

  createMD5Hash(input: string) {
    return crypto.createHash('md5').update(input).digest('hex');
  }

  executeWithCache = async <T>(cacheId: string, callback: () => Promise<T>) => {
    const cacheKey = path.join(os.tmpdir(), `${cacheId}.json`);

    // Cache path es un fichero
    // Necesito crear la carpeta si no existe actualmente
    const folder = path.dirname(cacheKey);
    fs.mkdirSync(folder, { recursive: true });

    const exists = fs.existsSync(cacheKey);
    if (exists) {
      return require(cacheKey) as T;
    } else {
      const result = await callback();
      fs.writeFileSync(cacheKey, JSON.stringify(result, null, 2));
      return result;
    }
  };
}

export const util = new Util();
