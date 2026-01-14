import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

export function setupSocketIO(io: Server) {
  // Authentication middleware
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
        },
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handling
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.user?.name} connected`);

    // Join user to their personal room
    socket.join(`user:${socket.userId}`);

    // Broadcast user online status
    socket.broadcast.emit('user-online', socket.userId);

    // Handle joining chat rooms
    socket.on('join-chat', (chatId: string) => {
      socket.join(`chat:${chatId}`);
      console.log(`User ${socket.userId} joined chat ${chatId}`);
    });

    // Handle leaving chat rooms
    socket.on('leave-chat', (chatId: string) => {
      socket.leave(`chat:${chatId}`);
      console.log(`User ${socket.userId} left chat ${chatId}`);
    });

    // Handle sending messages
    socket.on('send-message', async (data: {
      chatId: string;
      content: string;
      type: 'text' | 'image' | 'file';
      receiverId?: string;
    }) => {
      try {
        // Save message to database
        const message = await prisma.message.create({
          data: {
            content: data.content,
            type: data.type.toUpperCase() as any,
            chatId: data.chatId,
            senderId: socket.userId!,
            receiverId: data.receiverId,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        });

        // Emit to chat room
        io.to(`chat:${data.chatId}`).emit('new-message', message);

        // Send push notification to receiver if offline
        if (data.receiverId) {
          const receiverSockets = await io.in(`user:${data.receiverId}`).fetchSockets();
          if (receiverSockets.length === 0) {
            // User is offline, could send push notification here
            console.log(`User ${data.receiverId} is offline, should send push notification`);
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data: { chatId: string; receiverId: string }) => {
      socket.to(`chat:${data.chatId}`).emit('user-typing', {
        userId: socket.userId,
        userName: socket.user?.name,
      });
    });

    socket.on('typing-stop', (data: { chatId: string }) => {
      socket.to(`chat:${data.chatId}`).emit('user-stopped-typing', {
        userId: socket.userId,
      });
    });

    // Handle post interactions
    socket.on('like-post', async (data: { postId: string }) => {
      try {
        // Toggle like in database
        const existingLike = await prisma.postLike.findUnique({
          where: {
            userId_postId: {
              userId: socket.userId!,
              postId: data.postId,
            },
          },
        });

        if (existingLike) {
          await prisma.postLike.delete({
            where: { id: existingLike.id },
          });
          
          await prisma.post.update({
            where: { id: data.postId },
            data: { likes: { decrement: 1 } },
          });
        } else {
          await prisma.postLike.create({
            data: {
              userId: socket.userId!,
              postId: data.postId,
            },
          });
          
          await prisma.post.update({
            where: { id: data.postId },
            data: { likes: { increment: 1 } },
          });
        }

        // Broadcast like update
        io.emit('post-like-updated', {
          postId: data.postId,
          userId: socket.userId,
          liked: !existingLike,
        });
      } catch (error) {
        console.error('Error handling like:', error);
      }
    });

    // Handle real-time notifications
    socket.on('mark-notification-read', async (notificationId: string) => {
      // Mark notification as read in database
      console.log(`Marking notification ${notificationId} as read for user ${socket.userId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.user?.name} disconnected`);
      
      // Broadcast user offline status
      socket.broadcast.emit('user-offline', socket.userId);
    });

    // Send current online users
    const sendOnlineUsers = async () => {
      const sockets = await io.fetchSockets();
      const onlineUserIds = sockets.map((s: any) => s.userId).filter(Boolean);
      socket.emit('online-users', onlineUserIds);
    };

    sendOnlineUsers();
  });

  // Periodic cleanup and maintenance
  setInterval(async () => {
    const sockets = await io.fetchSockets();
    console.log(`Currently ${sockets.length} users connected`);
  }, 60000); // Every minute
}