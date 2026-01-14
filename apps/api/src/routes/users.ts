import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        // Don't expose sensitive information
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Get user's posts
router.get('/:id/posts', async (req, res) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
        status: 'APPROVED',
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
        _count: {
          select: {
            postLikes: true,
            postComments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    const transformedPosts = posts.map(post => ({
      ...post,
      likes: post._count.postLikes,
      comments: post._count.postComments,
    }));

    res.json({
      posts: transformedPosts,
      pagination: {
        page,
        limit,
        total: await prisma.post.count({
          where: {
            authorId: userId,
            status: 'APPROVED',
          },
        }),
      },
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Search users
router.get('/', async (req, res) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        error: 'Search query must be at least 2 characters',
      });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
      skip,
      take: limit,
    });

    res.json({
      users,
      pagination: {
        page,
        limit,
        total: await prisma.user.count({
          where: {
            OR: [
              {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        }),
      },
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;