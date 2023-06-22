import knex from '../../db/knex';

export const unRead = async (id: number, role: string) => {
  const where = { recipient_id: id, recipient_type: role, is_read: false };
  const unreadCount = +(await knex('notification').where(where).count('id'))[0].count;

  return unreadCount;
};

export const index = async (id: number, role: string) => {
  const where = { recipient_id: id, recipient_type: role };
  const notifications = await knex('notification').where(where).limit(6).orderBy('id', 'desc');

  return notifications;
};

export const create = async (data: object) => {
  const notification = await knex('notification').insert(data).returning('*');
  return notification[0];
};

export const update = async (id: number, role: string) => {
  const where = { recipient_id: id, recipient_type: role, is_read: false };
  await knex('notification').where(where).update({ is_read: true });
};

export const pagination = async (id: number, role: string, page: number) => {
  const where = { recipient_id: id, recipient_type: role };
  const query = knex('notification').where(where);
  const query2 = query.clone();

  const perPage = 12;
  const skip = (page - 1) * perPage;
  const total = +(await query.count('id'))[0].count;
  const numberOfPages = Math.ceil(total / perPage);
  const next = page * perPage < total ? true : false;
  const prev = page > 1 ? true : false;
  const notifications = await query2.select('*').limit(12).offset(skip).orderBy('id', 'desc');

  return { pagination: { page, next, prev, numberOfPages, total }, notifications };
};
