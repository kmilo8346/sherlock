import {
  BulkInsights,
  CreateInsight,
  DataSource,
  Insight,
  QueryDataSource,
  Tweet,
} from '@sherlock/models';
import chunk from 'lodash/chunk';
import { AgglomerationMethod, Cluster, agnes } from 'ml-hclust';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { insightClient, openaiClient, tweetClient } from '../clients';
import { util } from './Util';

interface ITimeWindow {
  start_time: string;
  end_time: string;
}

interface ITweetsCompressed {
  data: Tweet[];
  hidded: Record<string, Tweet[]>;
}

interface ITag {
  /**
   * Id autogenerado del tag
   */
  id: string;
  /**
   * Nombre del tag
   * COMENTARIO_POSITIVO
   */
  name: string;

  /**
   * Descripción más detallada del tag
   * y que ayuda a la indexacion multidimensional
   */
  description: string;

  /**
   * Tags hijos
   */
  children: ITag[];

  /**
   * Todos los tweets que contienen este tag
   */
  twitter_ids: string[];

  /**
   * Fecha de creación, se toma la fecha del primer tweet
   */
  created_at: string;
}

export class Analyzer {
  /**
   * Analiza...
   * @param authorIds
   * @param timeWindow
   */
  async generateInsights(dataSource: DataSource) {
    const timeWindow = this.getTimeWindow();

    // 1. Busco tweets
    const tweets = await this.getTweets(timeWindow, dataSource);

    // Si no hay tweets detengo la ejecución
    // clusterizar sin datos falla
    if (tweets.length === 0) {
      return;
    }

    // 2. Comprimo los tweets
    const compressed = await this.compressTweets(tweets);

    // 3. Retorno los tweets comprimidos
    const filtered = await this.filterTweets(dataSource, compressed.data);

    // Si no hay tweets filtrados detengo la ejecución
    // clusterizar sin datos falla
    if (filtered.length === 0) {
      return;
    }

    // 4. Descubro los tags
    const discoveredTags = await this.discoverTags(filtered, compressed);

    // 5. Normalizo los tags
    const normalizedTags = await this.normalizeTags(discoveredTags);

    // 6. Salvar insights en la base de datos
    await this.saveInsights(timeWindow, dataSource, normalizedTags);
  }

  private async getTweets(timeWindow: ITimeWindow, dataSource: DataSource) {
    console.log('');
    console.log('Buscando tweets...');

    const tweets: Tweet[] = [];

    // 1. Busco tweets
    let from = 0;
    const size = 10;
    while (true) {
      // DEBUG CODE
      //   console.log('from:', from);
      //   console.log('size:', size);
      //   console.log('authorIds:', authorIds);
      //   console.log('timeWindow:', timeWindow);
      //   console.log(
      //     'Start:',
      //     this.getUTCDateFromHours(
      //       executionDate,
      //       dataSource.time_window.start_hour
      //     )
      //   );
      //   console.log(
      //     'End:',
      //     this.getUTCDateFromHours(executionDate, dataSource.time_window.end_hour)
      //   );

      const response = await tweetClient.getAll({
        from,
        size,
        filter: {
          query_id: {
            $in: dataSource.queries.map((q) => this.createQueryId(q)),
          },
          created_at: {
            $gte: timeWindow.start_time,
            $lte: timeWindow.end_time,
          },
        },
      });

      // Guardo resultados
      tweets.push(...response.data);

      // Paginacion
      from += size;

      // Condicion de salida
      if (response.data.length < size) {
        break;
      }
    }

    console.log('> Tweets encontrados:', tweets.length);

    return tweets;
  }

  private async compressTweets(tweets: Tweet[]) {
    console.log('');
    console.log('Comprimiendo tweets...');

    // Algoritmo:
    // 1- Genero los embeddings de los tweets
    // 2- Creo la matriz de distancias
    // 3- Clusterizo los tweets
    // 4- Retorno los tweets comprimidos

    // --------------------------------------------
    // 1- Generar embeddings de los tweets
    // usando openai embedding api
    const chunks = chunk(tweets, 30);
    const embeddings: number[][] = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Crear embeddings para cada tweet
      // si no se ha creado previamente
      const cacheKey = path.join(
        'compress',
        'embeddings',
        util.createMD5Hash(chunk.map((t) => t._id).join('_'))
      );
      const result = await util.executeWithCache<number[][]>(
        cacheKey,
        async () => {
          const result = await openaiClient.embeddings.create({
            model: 'text-embedding-3-large',
            input: chunk.map((t) => t.text),
            encoding_format: 'float',
          });
          return result.data.map((d) => d.embedding);
        }
      );

      // Guardo embeddings
      embeddings.push(...result);

      console.log('> Embeddings:', i + 1, '/', chunks.length);
    }

    // --------------------------------------------
    // 2- Crear matrix de distancias
    let distances: number[][] = [];

    // Inicializo la matriz de distancias
    distances = Array(tweets.length).fill(null);
    distances = distances.map(() => Array(tweets.length));

    // Crear matriz de distancias
    for (let i = 0; i < tweets.length; i++) {
      const from = embeddings[i];

      // Guardar distancias
      for (let j = i; j < tweets.length; j++) {
        const to = embeddings[j];

        // Calcular distancias entre los embeddings
        // si es que no se ha calculado previamente
        const cacheKey = path.join(
          'compress',
          'distances',
          `${tweets[i]._id}_${tweets[j]._id}`
        );
        const distance = await util.executeWithCache<number>(
          cacheKey,
          async () => {
            return util.cosineDistance(from, to);
          }
        );

        distances[i][j] = distance;
        distances[j][i] = distance;
      }

      console.log('> Distances:', i + 1, '/', tweets.length, 'processed');
    }

    // --------------------------------------------
    // 3- Clusterizar usando un umbral estático
    // Esto me va a permitir identificar los tweets repetidos
    const linkageMethod: AgglomerationMethod = 'average'; // Método de enlace
    const clusters: Cluster = agnes(distances, {
      method: linkageMethod,
      isDistanceMatrix: true,
    });

    // Función para obtener los clusters con un umbral de corte
    function getClusters(node: Cluster, threshold: number): string[][] {
      const clusters: string[][] = [];
      function traverse(node: Cluster, cluster: string[]) {
        if (node.height <= threshold) {
          if (node.isLeaf) {
            cluster.push(tweets[node.index]._id);
          } else {
            node.children.forEach((child) => traverse(child, cluster));
          }
        } else {
          node.children.forEach((child) => {
            const newCluster: string[] = [];
            traverse(child, newCluster);
            clusters.push(newCluster);
          });
        }
      }
      traverse(node, []);
      return clusters;
    }

    const threshold = 0.11; // Umbral para definir el corte de los clusters
    let result = getClusters(clusters, threshold);

    // Creo tweets comprimidos
    const compressed: ITweetsCompressed = { data: [], hidded: {} };
    for (let i = 0; i < result.length; i++) {
      const cluster = result[i];

      // Ignoro los clusters vacios
      if (cluster.length === 0) {
        continue;
      }

      const tweetsInCluster = cluster.map((id) =>
        tweets.find((t) => t._id === id)
      );

      let tweetToSave = tweetsInCluster[0]!;
      if (tweetsInCluster.length > 1) {
        // Buscar el tweet más relevante
        // el que mas caracteres tenga
        tweetToSave = tweetsInCluster.reduce((acc, tweet) => {
          if (tweet!.text.length > acc!.text.length) {
            return tweet;
          }
          return acc;
        }, tweetsInCluster[0]!)!;

        // Guardar los tweets ocultos
        const hidded = tweetsInCluster.filter((t) => t._id !== tweetToSave._id);

        compressed.hidded[tweetToSave._id] = hidded;
      }

      compressed.data.push(tweetToSave);
    }

    console.log('> Tweets comprimidos');

    return compressed;
  }

  private async filterTweets(dataSource: DataSource, tweets: Tweet[]) {
    console.log('');
    console.log('Filtrando tweets...');

    // Algoritmo:
    // 1- Filtrar los tweets que hablen directamente del tópico
    // 2- Filtrar los tweets que hablen de hechos del tópico

    // --------------------------------------------
    // 1- Filtrar los tweets que hablen directamente del tópico
    const test1Passed: Tweet[] = [];
    const test1Chunks = chunk(tweets, 5);
    for (let i = 0; i < test1Chunks.length; i++) {
      const chunk = test1Chunks[i];

      // Filtro los tweets que hablen directamente del tópico
      // si es que no se ha filtrado previamente
      const cacheKey = path.join(
        'filter',
        'related',
        util.createMD5Hash(chunk.map((t) => t._id).join('_'))
      );
      const results = await util.executeWithCache(cacheKey, async () => {
        let retries = 0;
        const askIfRelated = async (
          tweets: Tweet[]
        ): Promise<
          {
            id: string;
            test: boolean;
          }[]
        > => {
          try {
            const result = await openaiClient.chat.completions.create({
              model: 'gpt-4o',
              seed: 20,
              temperature: 0,
              response_format: {
                type: 'json_object',
              },
              messages: [
                {
                  role: 'system',
                  content: `
                                ##¿Que hace este GPT?
                                - Identifica si el tweet habla directamente sobre ${dataSource.label}.

                                ##¿Cómo se comporta?
                                - Es muy detallista es su trabajo.
                                - Revisa su decisión dos veces para evitar errores.

                                ##¿Que debería evitar hacer?
                                - Identificar incorrectamente un tweet.

                                ##Respuesta:
                                - Responde en formato JSON un objeto con un campo results que es un array de objetos. Cada objeto del array tiene dos propiedades el id del tweet y un boolean que que es true si está directamente relacionado y false en caso contrario.
                                ###Ejemplo:
                                {
                                    "results": [
                                        {
                                            "id": "1",
                                            "test": true
                                        },
                                        {
                                            "id": "2",
                                            "test": false
                                        }
                                    ]
                                }
                            `,
                },
                {
                  role: 'user',
                  content: `
                                #Tweets a filtrar:
                                ${tweets.reduce(
                                  (acc, tweet) =>
                                    `${acc} \n\n id: ${tweet._id} \n text: ${tweet.text}`,
                                  ''
                                )}
                                `,
                },
              ],
            });

            const testParsed = JSON.parse(
              result.choices[0]!.message.content!
            ).results;

            retries = 0;

            return testParsed;
          } catch (error) {
            if (retries > 2) {
              throw error;
            }
            retries++;
            console.error(`Failed asking if related, retrying...`);
            return await askIfRelated(tweets);
          }
        };

        return await askIfRelated(chunk);
      });

      // Agregar los tweets que pasaron el filtro
      test1Passed.push(
        ...chunk.filter((tweet) => {
          const result = results.find((result) => result.id === tweet._id);
          return result?.test;
        })
      );

      console.log(
        `> Test (Related): ${i + 1} of ${test1Chunks.length} processed...`
      );
    }

    // --------------------------------------------
    // 2- Filtrar los tweets que hablen de hechos del tópico
    const filtered: Tweet[] = [];
    const test2Chunks = chunk(test1Passed, 5);
    for (let i = 0; i < test2Chunks.length; i++) {
      const chunk = test2Chunks[i];

      // Filtro los tweets que hablen de hechos del tópico
      // si es que no se ha filtrado previamente
      const cacheKey = path.join(
        'filter',
        'fact',
        util.createMD5Hash(chunk.map((t) => t._id).join('_'))
      );
      const results = await util.executeWithCache(cacheKey, async () => {
        let retries = 0;
        const askIfFact = async (
          tweets: Tweet[]
        ): Promise<
          {
            id: string;
            test: boolean;
          }[]
        > => {
          try {
            const result = await openaiClient.chat.completions.create({
              model: 'gpt-4o',
              seed: 20,
              temperature: 0,
              response_format: {
                type: 'json_object',
              },
              messages: [
                {
                  role: 'system',
                  content: `
                                ##¿Que hace este GPT?
                                Identifica si la idea central del tweet trata sobre hechos concretos ocurridos, que están ocurriendo o que van a ocurrir con ${dataSource.label}. En el tweet debe haber detalle específico de estos hechos. Un hecho concreto debe estar relacionado a un contexto claro, como tiempo, lugar, y debe ser verificable.

                                ##¿Cómo se comporta?
                                - Es muy detallista es su trabajo.
                                - Revisa su decisión dos veces para evitar errores.

                                ##¿Que debería evitar hacer?
                                - Identificar tweets que no traten sobre hechos.
                                - Considerar rumores, especulaciones o declaraciones vagas como hechos concretos.
                                - Evaluar tweets sin detalles claros y verificables sobre el hecho mencionado.

                                ##Respuesta:
                                - Responde en formato JSON un objeto con un campo results que es un array de objetos. Cada objeto del array tiene dos propiedades el id del tweet y un boolean que que es true si cumple con las instrucciones y false en caso contrario.
                                ###Ejemplo:
                                {
                                    "results": [
                                        {
                                            "id": "1",
                                            "test": true
                                        },
                                        {
                                            "id": "2",
                                            "test": false
                                        }
                                    ]
                                }
                            `,
                },
                {
                  role: 'user',
                  content: `
                                #Tweets a filtrar:
                                ${tweets.reduce(
                                  (acc, tweet) =>
                                    `${acc} \n\n id: ${tweet._id} \n text: ${tweet.text}`,
                                  ''
                                )}
                                `,
                },
              ],
            });

            const testParsed = JSON.parse(
              result.choices[0]!.message.content!
            ).results;

            retries = 0;

            return testParsed;
          } catch (error) {
            if (retries > 2) {
              throw error;
            }
            retries++;
            console.error(`Failed asking if it is a fact, retrying...`);
            return await askIfFact(tweets);
          }
        };

        return await askIfFact(chunk);
      });

      // Agregar los tweets que pasaron el filtro
      filtered.push(
        ...chunk.filter((tweet) => {
          const test = results.find((result) => result.id === tweet._id);
          return test?.test;
        })
      );

      console.log(
        `> Test (Fact): ${i + 1} of ${test2Chunks.length} processed...`
      );
    }

    console.log('> Tweets filtrados', filtered.length);

    return filtered;
  }

  private async discoverTags(tweets: Tweet[], compressed: ITweetsCompressed) {
    console.log('');
    console.log('Descubriendo tags...');

    // Algoritmo:
    // 1- Descubrir tags usando el robot de open ai
    // 2- Agregar los ids que se comprimieron a las tags

    // --------------------------------------------
    // 1- Descubrir tags usando el robot de open ai
    const discoverTags: ITag[] = [];
    const chunks = chunk(tweets, 5);
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const promises: Promise<{
        id: string;
        short_description: string;
        detailed_description: string;
      }>[] = [];
      for (let j = 0; j < chunk.length; j++) {
        const tweet = chunk[j];

        promises.push(
          util.executeWithCache(
            path.join('discover', 'tags', tweet._id),
            async () => {
              let retries = 0;
              const discover = async () => {
                try {
                  const result = await openaiClient.chat.completions.create({
                    model: 'gpt-4o',
                    seed: 30,
                    temperature: 0.1,
                    response_format: {
                      type: 'json_object',
                    },
                    messages: [
                      {
                        role: 'system',
                        content: `
                                    ## ¿Qué hace este GPT?
                                    Describe la idea principal del tweet de la manera más entendible posible con una longitud máxima de cuatro palabras.
                                    La descripción debe ser en ESPAÑOL y no incluyas preposiciones.
            
                                    ## ¿Cómo se comporta?
                                    - Es muy detallista en su trabajo.
            
                                    ## Respuesta:
                                    - Responde en formato JSON un objeto con tres propiedades el id del tweet, la descripción pequeña de la idea principal del tweet y una descripción más detallada.
            
                                    ### Ejemplo:
                                    {
                                        "id": "1",
                                        "short_description": "Short description 1",
                                        "detailed_description": "Detailed description 1"
                                    }
                                `,
                      },
                      {
                        role: 'user',
                        content: `
                                    ##Tweet:
                                    id: ${tweet._id} \n tweet: ${tweet.text}
                                    `,
                      },
                    ],
                  });

                  const parsedResult: {
                    id: string;
                    short_description: string;
                    detailed_description: string;
                  } = JSON.parse(result.choices[0]!.message.content!);

                  retries = 0;

                  return parsedResult;
                } catch (error) {
                  if (retries > 2) {
                    throw error;
                  }

                  retries++;
                  console.error(
                    `Failed discovering tags(${tweet._id}), retrying...`
                  );
                  return await discover();
                }
              };

              return await discover();
            }
          )
        );
      }

      const results = await Promise.all(promises);

      results.forEach((result) => {
        const tweet = chunk.find((t) => t._id === result.id);

        const name = result.short_description
          // espacios, puntos, guiones
          .split(/[\s./\\-]+/)
          .map((w) => w.toUpperCase())
          .map((w) => w.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
          .join('_');

        discoverTags.push({
          id: uuidv4(),
          name,
          description: result.detailed_description,
          children: [],
          twitter_ids: [tweet._id],
          created_at: tweet.created_at,
        });
      });

      console.log('> Discover tags:', i + 1, '/', chunks.length);
    }

    // --------------------------------------------
    // 2- Agregar los ids que se comprimieron a las tags
    for (let i = 0; i < discoverTags.length; i++) {
      const tag = discoverTags[i];
      for (let j = 0; j < tag.twitter_ids.length; j++) {
        const id = tag.twitter_ids[j];
        if (compressed.hidded[id]) {
          tag.twitter_ids.push(...compressed.hidded[id].map((t) => t._id));

          // Actualizo created at con la fecha más antigua
          tag.created_at = compressed.hidded[id].reduce((acc, t) => {
            if (new Date(t.created_at) < new Date(acc)) {
              return t.created_at;
            }
            return acc;
          }, tag.created_at);
        }
      }
    }

    console.log('> Tags descubiertos');

    return discoverTags;
  }

  private async normalizeTags(discoveredTags: ITag[]) {
    console.log('');
    console.log('Normalizando tags...');

    // Algoritmo:
    // 1- Generar embeddings de las tags
    // 2- Crear la matriz de distancias
    // 3- Clusterizar las tags
    // 4- Normalizar las tags

    // --------------------------------------------
    // 1- Generar embeddings de las tags
    // Generar embeddings de las tags
    // usando openai embedding api
    const chunks = chunk(discoveredTags, 5);
    const embeddings: number[][] = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Crear embeddings para los tags
      // si no se ha creado previamente
      const cacheKey = path.join(
        'normalize',
        'embeddings',
        util.createMD5Hash(chunk.map((t) => t.id).join('_'))
      );
      const results = await util.executeWithCache(cacheKey, async () => {
        const response = await openaiClient.embeddings.create({
          model: 'text-embedding-3-large',
          input: chunk.map(
            (tag) => `
                    TAG: ${tag.name}
                    DESCRIPTION: ${tag.description}
                `
          ),
          encoding_format: 'float',
        });
        return response.data.map((d) => d.embedding);
      });

      // Guardar los embeddings
      embeddings.push(...results);

      console.log('> Embeddings:', i + 1, '/', chunks.length);
    }

    // --------------------------------------------
    // 2- Crear matrix de distancias
    const distances: number[][] = [];
    for (let i = 0; i < discoveredTags.length; i++) {
      distances.push([]);
      for (let j = 0; j < discoveredTags.length; j++) {
        const from = embeddings[i];
        const to = embeddings[j];

        // Calcular distancias entre los embeddings
        // si es que no se ha calculado previamente
        const cacheKey = path.join(
          'normalize',
          'distances',
          `${discoveredTags[i].id}_${discoveredTags[j].id}`
        );
        distances[i][j] = await util.executeWithCache<number>(
          cacheKey,
          async () => util.cosineDistance(from, to)
        );
      }
    }

    // --------------------------------------------
    // 3- Clusterizar usando un umbral estático
    const linkageMethod: AgglomerationMethod = 'average'; // Método de enlace
    const clusters: Cluster = agnes(distances, {
      method: linkageMethod,
      isDistanceMatrix: true,
    });

    // Función para obtener los clusters con un umbral de corte
    function getClusters(node: Cluster, threshold: number): string[][] {
      const clusters: string[][] = [];
      function traverse(node: Cluster, cluster: string[]) {
        if (node.height <= threshold) {
          if (node.isLeaf) {
            cluster.push(discoveredTags[node.index].id);
          } else {
            node.children.forEach((child) => traverse(child, cluster));
          }
        } else {
          node.children.forEach((child) => {
            const newCluster: string[] = [];
            traverse(child, newCluster);
            clusters.push(newCluster);
          });
        }
      }
      traverse(node, []);
      return clusters;
    }

    // 0.15
    // 0.25
    const threshold = 0.25; // Umbral para definir el corte de los clusters
    let result = getClusters(clusters, threshold);

    const normalizedTags: ITag[] = [];
    for (let i = 0; i < result.length; i++) {
      const cluster = result[i];
      if (cluster.length === 0) {
        continue;
      }

      const clusterTags = cluster.map(
        (id) => discoveredTags.find((t) => t.id === id)!
      );

      let normalizedTag = clusterTags[0];
      if (clusterTags.length > 1) {
        // Normalizar las tags
        // si no se ha normalizado previamente
        const cacheKey = path.join(
          'normalize',
          'normalized',
          util.createMD5Hash(clusterTags.map((t) => t.id).join('-'))
        );
        const info = await util.executeWithCache(cacheKey, async () => {
          // Normalizo el nombre y la descripción
          // usando el robot agrupador de tags
          let retries = 0;
          const normalizeTags = async (
            tags: ITag[]
          ): Promise<{ name: string; description: string }> => {
            try {
              const response = await openaiClient.chat.completions.create({
                model: 'gpt-4o',
                top_p: 0.9,
                response_format: {
                  type: 'json_object',
                },
                messages: [
                  {
                    role: 'system',
                    content: `
                            ## ¿Qué hace este GPT?
                            Dado una lista de etiquetas que todas son del mismo tema, pero que se escribieron de diferentes formas debes crear una nueva etiqueta que represente a las demás. Es importante que también generes una descripción, que puedes deducir de las descripciones de las etiquetas.

                            ## ¿Cómo se comporta?
                            - Es muy detallista en su trabajo.

                            ## ¿Qué debería evitar hacer?
                            -

                            ## Respuesta:
                            - Responde en formato JSON un objeto con el nombre y la descripción de la etiqueta.
                            ### Ejemplo:
                            {
                                "name": "NEW_TAG1",
                                "description": "DESCRIPCION NEW TAG1"
                            }
                        `,
                  },
                  {
                    role: 'user',
                    content: `
                            #Lista de etiquetas:
                            ${tags.reduce(
                              (acc, tag) =>
                                `${acc} \n name: ${tag.name} description: ${tag.description}`,
                              ''
                            )}
                            `,
                  },
                ],
              });

              const parsedResult: {
                name: string;
                description: string;
              } = JSON.parse(response.choices[0]!.message.content!);

              retries = 0;

              return parsedResult;
            } catch (error) {
              if (retries > 2) {
                throw error;
              }

              retries++;
              console.error('Failed normalizing, retrying...');
              return await normalizeTags(tags);
            }
          };

          return await normalizeTags(clusterTags);
        });

        normalizedTag = {
          id: uuidv4(),
          name: info.name,
          description: info.description,
          children: clusterTags,
          // Este campo son los twitter_ids de las tags que se agruparon
          // estos ids deben ser unicos, lo puedo hacer con un set
          twitter_ids: Array.from(
            new Set(
              clusterTags.reduce(
                (acc, tag) => [...acc, ...tag.twitter_ids],
                [] as string[]
              )
            )
          ),

          // Actualizo created at con la fecha más antigua del cluster
          created_at: clusterTags.reduce((acc, t) => {
            if (new Date(t.created_at) < new Date(acc)) {
              return t.created_at;
            }
            return acc;
          }, clusterTags[0].created_at),
        };
      }

      normalizedTags.push(normalizedTag);

      console.log('> Normalized:', i + 1, '/', result.length);
    }

    console.log('> Tags normalizados');

    return normalizedTags;
  }

  private async saveInsights(
    timeWindow: ITimeWindow,
    dataSource: DataSource,
    normalizedTags: ITag[]
  ) {
    console.log('');
    console.log('Guardando insights...');

    // Algoritmo:
    // Creo current insights mapeando los tags
    // Cargo previous insights
    // Comparo los insights
    // Guardo los insights (Create, Update, Delete)

    // 1. Creo current insights mapeando los tags
    const currentInsights: CreateInsight[] = normalizedTags.map((tag) => {
      const insight: CreateInsight = {
        data_source_id: dataSource._id,
        slug: tag.name,
        content: tag.description,
        stats: {
          tweets: 0,
          retweets: 0,
        },
        created_at: tag.created_at,
      };
      return insight;
    });

    // 2. Cargo previous insights
    const previousInsights: Insight[] = [];
    let from = 0;
    const size = 20;
    while (true) {
      const response = await insightClient.getAll({
        from,
        size,
        filter: {
          data_source_id: dataSource._id,
          created_at: {
            $gte: timeWindow.start_time,
            $lte: timeWindow.end_time,
          },
        },
      });

      // Guardo resultados
      previousInsights.push(...response.data);

      // Paginacion
      from += size;

      // Condicion de salida
      if (response.data.length < size) {
        break;
      }
    }

    // 3. Comparo los insights
    // CREATE - Si no existe en previousInsights
    // UPDATE - Si existe en previousInsights
    // DELETE - Si no existe en currentInsights
    const bulkInsights: BulkInsights = {
      operations: [],
    };
    for (const current of currentInsights) {
      const previous = previousInsights.find((p) => p.slug === current.slug);
      if (!previous) {
        bulkInsights.operations.push({
          type: 'CREATE',
          data: current,
        });
      } else {
        bulkInsights.operations.push({
          type: 'UPDATE',
          id: previous._id,
          data: {
            content: current.content,
            stats: current.stats,
          },
        });
      }
    }

    for (const previous of previousInsights) {
      const current = currentInsights.find((c) => c.slug === previous.slug);
      if (!current) {
        bulkInsights.operations.push({
          type: 'DELETE',
          id: previous._id,
        });
      }
    }

    // // DEBUG CODE
    // console.log('previousInsights length:', previousInsights.length);
    // console.log('currentInsights length:', currentInsights.length);
    // console.log('bulkInsights:', JSON.stringify(bulkInsights, null, 2));

    // 4. Guardo los insights (Create, Update, Delete)
    if (bulkInsights.operations.length > 0) {
      await insightClient.bulk(bulkInsights);
    }

    console.log('> Insights guardados');
  }

  private createQueryId(query: QueryDataSource) {
    return `${query.type.toLowerCase()}|${query.value}`;
  }

  private getTimeWindow(): ITimeWindow {
    const start_time = new Date();
    start_time.setHours(0, 0, 0, 0); // Establece la hora al inicio del día

    const end_time = new Date();
    end_time.setHours(23, 59, 59, 999); // Establece la hora al final del día

    return {
      start_time: start_time.toISOString(),
      end_time: end_time.toISOString(),
    };
  }
}

export const analyzer = new Analyzer();
