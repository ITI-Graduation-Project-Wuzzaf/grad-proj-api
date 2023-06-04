import { Server } from 'socket.io';
import { Server as httpServer } from 'http';

import * as notifications from './notifications';
import { notifSchema, socketSchema } from './validation/socket';

export const socketIO = (server: httpServer) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  interface ISocketData {
    id: number;
    role: string;
  }

  interface INotif extends ISocketData {
    jobId: number;
    jobName: string;
    appId: number;
  }

  io.on('connection', (socket) => {
    socket.on('add-user', async ({ id, role }: ISocketData) => {
      const { error } = socketSchema.validate({ id, role });
      if (error) return;

      const room = `${role}_${id}`;

      socket.join(room);
      // io.to(room) to even include the sender

      socket.emit('unread-notifications', await notifications.unRead(id, role));

      socket.on('disconnect', () => {
        if (io.sockets.adapter.rooms.get(room)?.size === 0) {
          io.sockets.adapter.rooms.delete(room);
        }
      });
    });

    socket.on('read-notifications', async ({ id, role }: ISocketData) => {
      const { error } = socketSchema.validate({ id, role });
      if (error) return;

      const room = `${role}_${id}`;

      socket.emit('read-notifications', await notifications.index(id, role));
      await notifications.update(id, role);
      socket.to(room).emit('unread-notifications', 0);
    });

    // NOTE  HERE  this should be handled from the backend totally just emit the event
    socket.on('subscription-notification', async ({ id, role }: ISocketData) => {
      const { error } = socketSchema.validate({ id, role });
      if (error) return;

      const room = `${role}_${id}`;
      const url = '/subscription';
      const content = 'View premium subscription features.';
      const data = { content, url, recipient_id: id, recipient_type: role };
      const notification = await notifications.create(data);
      io.to(room).emit('notification', notification);
    });

    socket.on('notification', async ({ id, role, jobId, jobName, appId }: INotif) => {
      const { error } = notifSchema.validate({ id, role, jobId, jobName, appId });
      if (error) return;

      const room = `${role}_${id}`;
      const url = `/jobs/${jobId}/applications/${appId}}`;
      const content =
        role === 'employer'
          ? `A new candidate has applied for ${jobName}, Don't miss out.`
          : `A response has been sent by the recruiter of ${jobName}.`;
      const data = { content, url, recipient_id: id, recipient_type: role };
      const notification = await notifications.create(data);
      io.to(room).emit('notification', notification);
    });
  });
};
