import {
  BulkInsights,
  CreateInsight,
  Insight,
  UpdateInsight,
} from '@sherlock/models';
import { ICONFIG, RESTClient } from './RESTClient';

export class InsightClient extends RESTClient<
  Insight,
  CreateInsight,
  UpdateInsight
> {
  constructor(config: ICONFIG) {
    super(config, 'insights');
  }

  async bulk(bulkInsights: BulkInsights) {
    await this.axios.post(`/${this.collection}/bulk`, bulkInsights);
  }
}
