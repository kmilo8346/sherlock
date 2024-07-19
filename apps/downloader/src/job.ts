import { CreateTweet, QueryDataSource } from '@sherlock/models';
import { dataSourceClient, tweetClient, xClient } from './clients';

export class Job {
  async run() {
    // - Busca data sources activos
    // - Recorro las data sources activos
    //     - Voy unificando los queries
    //  - Descargo los tweets del día usando los queries

    console.log('');
    console.log('Starting downloader...');

    // 1. Busco los data sources activos
    let from = 0;
    const size = 5;
    while (true) {
      const dataSources = await dataSourceClient.getAll({
        from,
        size,
        filter: {
          enabled: true,
        },
      });

      // 2. Recorro los data sources activos
      const queries: QueryDataSource[] = [];
      for (const dataSource of dataSources.data) {
        // 3. Unifico los queries
        for (const query of dataSource.queries) {
          const match = queries.find(
            (q) => this.createQueryId(q) === this.createQueryId(query)
          );
          if (!match) {
            // Agrego la query si no existe
            queries.push(query);
          } else {
            // Actualizo el max_results, si es mayor
            match.max_results = Math.max(query.max_results, match.max_results);
          }
        }
      }

      // 4. Descargo los tweets del día usando los queries
      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        // 5. Descargo los tweets del día para esta query
        await this.downloadTweets(query);
      }

      // Paginación
      from += size;

      // El fin es cuando se retorna
      // menos data sources que el tamaño solicitado
      if (dataSources.data.length < dataSources.size) {
        break;
      }
    }

    console.log('> Downloader finished!');
    console.log('');
  }

  private async downloadTweets(queryDataSource: QueryDataSource) {
    const mapTweet = (tweet): CreateTweet => {
      const newTweet: CreateTweet = {
        _id: tweet.id,
        author_id: tweet.author_id,
        query_id: this.createQueryId(queryDataSource),
        text: tweet.text,
        public_metrics: tweet.public_metrics,
        in_reply_to_user_id: tweet.in_reply_to,
        edit_history_tweet_ids: tweet.edit_history_tweet_ids,
        created_at: tweet.created_at,
      };
      return newTweet;
    };

    // Valido que estoy en el rango de tiempo
    // Si estoy fuera no hago nada
    const today = new Date();
    const timeWindow = this.getTimeWindow();
    if (
      today < new Date(timeWindow.start_time) ||
      today > new Date(timeWindow.end_time)
    ) {
      return;
    }

    // Creo el query para twitter
    let query = '';
    switch (queryDataSource.type) {
      case 'ACCOUNT':
        query = `from:${queryDataSource.value}`;
        break;
      case 'SEARCH':
        query = queryDataSource.value;
        break;
    }

    // Busco en la base de datos los tweets
    // pertenecientes a esta query y a la ventana de tiempo
    // con esta información puedo saber desde donde
    // tengo que descargar los tweets
    // y la cantidad de tweets que tengo descargados

    const downloaded = await tweetClient.getAll({
      from: 0,
      size: 1,
      filter: {
        query_id: this.createQueryId(queryDataSource),
        created_at: {
          $gte: timeWindow.start_time,
          $lte: timeWindow.end_time,
        },
      },
      sort: {
        created_at: -1,
      },
    });
    let start_time = timeWindow.start_time;
    if (downloaded.data.length > 0) {
      const lastCreatedAtDate = new Date(downloaded.data[0].created_at);
      if (new Date(start_time) < lastCreatedAtDate) {
        // Si el start_time es menor al último tweet descargado
        // lo actualizo, pero con un segundo más para evitar
        // volver a descargar el mismo tweet
        lastCreatedAtDate.setSeconds(lastCreatedAtDate.getSeconds() + 1);
        start_time = lastCreatedAtDate.toISOString();
      }
    }

    // El totalPending es lo que se define en la query
    // pero le resto lo que ya tengo descargado
    let totalPending = Math.max(
      queryDataSource.max_results - downloaded.total,
      0
    );

    let count = 0;
    let nextToken: string = null;
    while (true) {
      let max_results = Math.min(totalPending - count, 100);

      const queryParams = {
        query,
        max_results,
        start_time,
        'tweet.fields':
          'id,created_at,author_id,text,public_metrics,in_reply_to_user_id',
      };
      if (nextToken) {
        queryParams['pagination_token'] = nextToken;
      }

      // Twitter API me arroja un error si el max_results es 0
      if (max_results <= 0) {
        break;
      }

      const response = await xClient.get('/tweets/search/recent', {
        params: queryParams,
      });

      // Condiciones de salida
      // - No se retornan tweets
      // - Si se retorna menos que lo que se solicito
      // - Si llego al máximo de resultados

      // No se retornan tweets
      if (response.data.meta.result_count === 0) {
        break;
      }

      // Salvo los tweets en la base de datos
      // para no perderlos si falla en proximos requests
      await tweetClient.createMany(response.data.data.map(mapTweet));

      // Incremento la cantidad de tweets descargados
      count += response.data.meta.result_count;

      // Si se retorna menos que lo que se solicito
      if (response.data.meta.result_count < max_results) {
        break;
      }

      // Si llego al máximo de resultados
      if (typeof queryDataSource.max_results !== undefined) {
        if (count >= queryDataSource.max_results) {
          break;
        }
      }

      // Refresco el nextToken
      nextToken = response.data.meta.next_token;
    }

    console.log(
      `> Downloaded ${count} tweets for query ${queryDataSource.type}:${queryDataSource.value}`
    );
  }

  private getTimeWindow() {
    const start_time = new Date();
    start_time.setHours(0, 0, 0, 0); // Establece la hora al inicio del día

    const end_time = new Date();
    end_time.setHours(23, 59, 59, 999); // Establece la hora al final del día

    return {
      start_time: start_time.toISOString(),
      end_time: end_time.toISOString(),
    };
  }

  private createQueryId(query: QueryDataSource) {
    return `${query.type.toLowerCase()}|${query.value}`;
  }
}

export const job = new Job();
