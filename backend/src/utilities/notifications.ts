import knex from '../../db/knex';

export const unRead = async (id: number, role: string) => {
  const where = { recipient_id: id, recipient_type: role, is_read: false };
  const unreadCount = +(await knex('notification').where(where).count('id'))[0].count;

  return unreadCount;
};

export const index = async (id: number, role: string) => {
  const where = { recipient_id: id, recipient_type: role };
  const notifications = await knex('notification').where(where).limit(6);

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
