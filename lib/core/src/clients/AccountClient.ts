import { Account, CreateAccount, UpdateAccount } from '@sherlock/models';
import { ICONFIG, RESTClient } from './RESTClient';

export class AccountClient extends RESTClient<
  Account,
  CreateAccount,
  UpdateAccount
> {
  constructor(config: ICONFIG) {
    super(config, 'accounts');
  }
}
