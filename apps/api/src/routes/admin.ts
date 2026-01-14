import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { createNotification } from './notifications';

const router = express.Router();
const prisma = new PrismaClient();

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalPosts, pendingPosts, totalTokens] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PENDING' } }),
      prisma.tokenTransaction.aggregate({
        _sum: { amount: true },
        where: { amount: { gt: 0 } },
      }),
    ]);

    res.json({
      totalUsers,
      totalPosts,
      pendingPosts,
      totalTokens: totalTokens._sum.amount || 0,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Get pending posts
router.get('/posts/pending', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      where: { status: 'PENDING' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // Oldest first for review
      },
      skip,
      take: limit,
    });

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total: await prisma.post.count({ where: { status: 'PENDING' } }),
      },
    });
  } catch (error) {
    console.error('Get pending posts error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Approve post
router.post('/posts/:id/approve', async (req, res) => {
  try {
    const postId = req.params.id;
    const adminId = (req as any).user.id;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
      });
    }

    if (post.status !== 'PENDING') {
      return res.status(400).json({
        error: 'Post is not pending approval',
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'APPROVED',
        reviewedById: adminId,
        reviewedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    // Send notification to post author
    const io = req.app.get('io');
    await createNotification(
      post.authorId,
      'post_approved',
      'Post Approved',
      `Your post "${post.title}" has been approved and is now visible to everyone.`,
      io
    );

    res.json(updatedPost);
  } catch (error) {
    console.error('Approve post error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Reject post
router.post('/posts/:id/reject', async (req, res) => {
  try {
    const postId = req.params.id;
    const adminId = (req as any).user.id;
    const { reason } = req.body;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true },
    });

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
      });
    }

    if (post.status !== 'PENDING') {
      return res.status(400).json({
        error: 'Post is not pending approval',
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'REJECTED',
        reviewedById: adminId,
        reviewedAt: new Date(),
        rejectionReason: reason,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    // Refund tokens to user
    await prisma.user.update({
      where: { id: post.authorId },
      data: {
        tokenBalance: {
          increment: post.tokenCost,
        },
      },
    });

    // Create refund transaction
    await prisma.tokenTransaction.create({
      data: {
        type: 'REFUND',
        amount: post.tokenCost,
        description: `Post rejected: ${post.title}`,
        userId: post.authorId,
        postId: post.id,
      },
    });

    // Send notification to post author
    const io = req.app.get('io');
    await createNotification(
      post.authorId,
      'post_rejected',
      'Post Rejected',
      `Your post "${post.title}" was rejected. ${reason ? `Reason: ${reason}` : ''} Your ${post.tokenCost} tokens have been refunded.`,
      io
    );

    res.json(updatedPost);
  } catch (error) {
    console.error('Reject post error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Get token requests
router.get('/tokens/requests', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const requests = await prisma.tokenRequest.findMany({
      where: { status: 'pending' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      skip,
      take: limit,
    });

    res.json({
      requests,
      pagination: {
        page,
        limit,
        total: await prisma.tokenRequest.count({ where: { status: 'pending' } }),
      },
    });
  } catch (error) {
    console.error('Get token requests error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Approve token request
router.post('/tokens/requests/:id/approve', async (req, res) => {
  try {
    const requestId = req.params.id;
    const adminId = (req as any).user.id;

    const tokenRequest = await prisma.tokenRequest.findUnique({
      where: { id: requestId },
    });

    if (!tokenRequest) {
      return res.status(404).json({
        error: 'Token request not found',
      });
    }

    if (tokenRequest.status !== 'pending') {
      return res.status(400).json({
        error: 'Token request is not pending',
      });
    }

    // Update request status
    await prisma.tokenRequest.update({
      where: { id: requestId },
      data: {
        status: 'approved',
        reviewedById: adminId,
        reviewedAt: new Date(),
      },
    });

    // Add tokens to user
    await prisma.user.update({
      where: { id: tokenRequest.userId },
      data: {
        tokenBalance: {
          increment: tokenRequest.amount,
        },
      },
    });

    // Create transaction record
    await prisma.tokenTransaction.create({
      data: {
        type: 'PURCHASE',
        amount: tokenRequest.amount,
        description: `Token purchase approved: ${tokenRequest.amount} tokens`,
        userId: tokenRequest.userId,
      },
    });

    // Send notification to user
    const io = req.app.get('io');
    await createNotification(
      tokenRequest.userId,
      'tokens',
      'Tokens Added',
      `Your token request for ${tokenRequest.amount} tokens has been approved!`,
      io
    );

    res.json({ message: 'Token request approved successfully' });
  } catch (error) {
    console.error('Approve token request error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Reject token request
router.post('/tokens/requests/:id/reject', async (req, res) => {
  try {
    const requestId = req.params.id;
    const adminId = (req as any).user.id;
    const { reason } = req.body;

    const tokenRequest = await prisma.tokenRequest.findUnique({
      where: { id: requestId },
    });

    if (!tokenRequest) {
      return res.status(404).json({
        error: 'Token request not found',
      });
    }

    if (tokenRequest.status !== 'pending') {
      return res.status(400).json({
        error: 'Token request is not pending',
      });
    }

    await prisma.tokenRequest.update({
      where: { id: requestId },
      data: {
        status: 'rejected',
        reviewedById: adminId,
        reviewedAt: new Date(),
        rejectionReason: reason,
      },
    });

    // Send notification to user
    const io = req.app.get('io');
    await createNotification(
      tokenRequest.userId,
      'tokens',
      'Token Request Rejected',
      `Your token request for ${tokenRequest.amount} tokens was rejected. ${reason ? `Reason: ${reason}` : ''}`,
      io
    );

    res.json({ message: 'Token request rejected successfully' });
  } catch (error) {
    console.error('Reject token request error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tokenBalance: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
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
      users,
      pagination: {
        page,
        limit,
        total: await prisma.user.count(),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;