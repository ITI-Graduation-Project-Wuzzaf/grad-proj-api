import { Knex } from 'knex';
import { IUser } from './user';
import { IProfile } from './profile';

declare module 'knex/types/tables' {
  interface Tables {
    user_account: IUser;
    profile: IProfile;
    // first where and select return type, second update, third upsert
    // NOTE  purpose of below types is for only insert and update
    user_composite: Knex.CompositeTableType<
      IUser,
      Pick<IUser, 'name'> & Partial<Pick<IUser, 'created_at' | 'updated_at'>>,
      Partial<Omit<IUser, 'id'>>
    >;
  }
}
