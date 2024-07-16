import { Account, CreateTweet } from '@sherlock/models';
import { accountClient, xClient, tweetClient } from './clients';

export class Job {
  async run() {
    // - Busca las cuentas activas
    // - Recorro las cuentas activas
    //     - Descargo los tweets desde la ultima fecha de sincronizacion.
    //     - Los tweets se guardan en la base de datos.
    //     - Actualizo la fecha de sincronizacion de la cuenta.

    console.log('');
    console.log('Starting downloader...');

    // 1. Busco las cuentas activas
    while (true) {
      const accounts = await accountClient.getAll({
        from: 0,
        size: 5,
        filter: {
          enabled: true,
        },
      });

      // 2. Recorro las cuentas activas
      for (const account of accounts.data) {
        // 3. Descargo los tweets desde la ultima fecha de sincronizacion.
        const tweets = await this.downloadTweets(account);

        // Si no hay tweets, continuo con la siguiente cuenta
        if (tweets.length === 0) {
          continue;
        }

        // 4. Los tweets se guardan en la base de datos.
        await tweetClient.createMany(tweets);

        // 5. Actualizo la fecha de sincronizacion de la cuenta.
        if (tweets.length > 0) {
          await accountClient.update(account._id, {
            last_sync_date: tweets[0].created_at,
          });
        }

        console.log(
          `> Downloaded ${tweets.length} tweets for ${account.username}`
        );
      }

      // El fin es cuando se retorna
      // menos cuentas que el tamaño solicitado
      if (accounts.data.length < accounts.size) {
        break;
      }
    }

    console.log('Downloader finished!');
    console.log('');
  }

  private async downloadTweets(account: Account): Promise<CreateTweet[]> {
    // Le agrego un segundo a la fecha de sincronización
    // para que no se descarguen los mismos tweets
    const lastSyncDate = new Date(account.last_sync_date);
    lastSyncDate.setSeconds(lastSyncDate.getSeconds() + 1);

    const response = await xClient.get('/tweets/search/recent', {
      params: {
        query: `from:${account.username}`,
        // Una cuenta no debería generar
        // más de 100 tweets en 5 minutos
        max_results: 100,
        start_time: lastSyncDate.toISOString(),
        'tweet.fields':
          'id,created_at,author_id,text,public_metrics,in_reply_to_user_id',
      },
    });

    if (response.data.meta.result_count === 0) {
      return [];
    }

    return response.data.data.map((tweet) => {
      const newTweet: CreateTweet = {
        _id: tweet.id,
        author_id: tweet.author_id,
        text: tweet.text,
        public_metrics: tweet.public_metrics,
        in_reply_to_user_id: tweet.in_reply_to,
        edit_history_tweet_ids: tweet.edit_history_tweet_ids,
        created_at: tweet.created_at,
      };
      return newTweet;
    });
  }
}

export const job = new Job();
