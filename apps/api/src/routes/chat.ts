import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's conversations
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const conversations = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Transform conversations for frontend
    const transformedConversations = conversations.map(chat => {
      const otherParticipant = chat.participants.find(p => p.userId !== userId);
      const lastMessage = chat.messages[0];

      return {
        id: chat.id,
        name: otherParticipant?.user.name || 'Unknown User',
        avatar: otherParticipant?.user.avatar,
        lastMessage: lastMessage?.content || '',
        timestamp: lastMessage?.createdAt || chat.createdAt,
        unread: 0, // TODO: Implement unread count
        online: false, // TODO: Implement online status
      };
    });

    res.json(transformedConversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Get messages for a chat
router.get('/:chatId/messages', authMiddleware, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Check if user is participant in this chat
    const participant = await prisma.chatParticipant.findFirst({
      where: {
        chatId,
        userId,
      },
    });

    if (!participant) {
      return res.status(403).json({
        error: 'Access denied to this chat',
      });
    }

    const messages = await prisma.message.findMany({
      where: { chatId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        total: await prisma.message.count({ where: { chatId } }),
      },
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Send a message
router.post('/messages', authMiddleware, async (req, res) => {
  try {
    const { chatId, receiverId, content, type = 'TEXT' } = req.body;
    const senderId = (req as any).user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: 'Message content is required',
      });
    }

    let chat;

    if (chatId) {
      // Use existing chat
      chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          participants: true,
        },
      });

      if (!chat) {
        return res.status(404).json({
          error: 'Chat not found',
        });
      }

      // Check if sender is participant
      const isParticipant = chat.participants.some(p => p.userId === senderId);
      if (!isParticipant) {
        return res.status(403).json({
          error: 'Access denied to this chat',
        });
      }
    } else if (receiverId) {
      // Create or find existing chat between sender and receiver
      const existingChat = await prisma.chat.findFirst({
        where: {
          isGroup: false,
          participants: {
            every: {
              userId: {
                in: [senderId, receiverId],
              },
            },
          },
        },
        include: {
          participants: true,
        },
      });

      if (existingChat && existingChat.participants.length === 2) {
        chat = existingChat;
      } else {
        // Create new chat
        chat = await prisma.chat.create({
          data: {
            isGroup: false,
            participants: {
              create: [
                { userId: senderId },
                { userId: receiverId },
              ],
            },
          },
          include: {
            participants: true,
          },
        });
      }
    } else {
      return res.status(400).json({
        error: 'Either chatId or receiverId is required',
      });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        type: type.toUpperCase(),
        chatId: chat.id,
        senderId,
        receiverId,
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

    // Update chat timestamp
    await prisma.chat.update({
      where: { id: chat.id },
      data: { updatedAt: new Date() },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Start a new conversation
router.post('/conversations', authMiddleware, async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = (req as any).user.id;

    if (!receiverId) {
      return res.status(400).json({
        error: 'Receiver ID is required',
      });
    }

    if (senderId === receiverId) {
      return res.status(400).json({
        error: 'Cannot start conversation with yourself',
      });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return res.status(404).json({
        error: 'Receiver not found',
      });
    }

    // Check if conversation already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        isGroup: false,
        participants: {
          every: {
            userId: {
              in: [senderId, receiverId],
            },
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (existingChat && existingChat.participants.length === 2) {
      return res.json(existingChat);
    }

    // Create new conversation
    const chat = await prisma.chat.create({
      data: {
        isGroup: false,
        participants: {
          create: [
            { userId: senderId },
            { userId: receiverId },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(chat);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;