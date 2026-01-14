import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { createNotification } from './notifications';

const router = express.Router();
const prisma = new PrismaClient();

// Get posts feed
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      where: {
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

    // Transform the response to match frontend expectations
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
        total: await prisma.post.count({ where: { status: 'APPROVED' } }),
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Create new post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, category, image } = req.body;
    const userId = (req as any).user.id;

    // Validation
    if (!title || !content || !category) {
      return res.status(400).json({
        error: 'Title, content, and category are required',
      });
    }

    if (content.length > 500) {
      return res.status(400).json({
        error: 'Content must be 500 characters or less',
      });
    }

    // Check user token balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tokenBalance: true },
    });

    const tokenCost = parseInt(process.env.DEFAULT_POST_TOKEN_COST || '10');

    if (!user || user.tokenBalance < tokenCost) {
      return res.status(400).json({
        error: 'Insufficient token balance',
      });
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        category: category.toUpperCase(),
        image: image || null,
        tokenCost,
        authorId: userId,
        status: 'PENDING',
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

    // Deduct tokens from user
    await prisma.user.update({
      where: { id: userId },
      data: {
        tokenBalance: {
          decrement: tokenCost,
        },
      },
    });

    // Create token transaction
    await prisma.tokenTransaction.create({
      data: {
        type: 'POST_CREATION',
        amount: -tokenCost,
        description: `Post creation: ${title}`,
        userId,
        postId: post.id,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Like/unlike post
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = (req as any).user.id;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
      });
    }

    // Check if user already liked the post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike the post
      await prisma.postLike.delete({
        where: { id: existingLike.id },
      });

      await prisma.post.update({
        where: { id: postId },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });

      res.json({ liked: false });
    } else {
      // Like the post
      await prisma.postLike.create({
        data: {
          userId,
          postId,
        },
      });

      await prisma.post.update({
        where: { id: postId },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      // Send notification to post author (if not liking own post)
      if (post.authorId !== userId) {
        const liker = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true },
        });
        const io = req.app.get('io');
        await createNotification(
          post.authorId,
          'like',
          'New Like',
          `${liker?.name || 'Someone'} liked your post "${post.title}"`,
          io
        );
      }

      res.json({ liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Get post comments
router.get('/:id/comments', async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await prisma.postComment.findMany({
      where: { postId },
      include: {
        user: {
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
    });

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Add comment to post
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = (req as any).user.id;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: 'Comment content is required',
      });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
      });
    }

    const comment = await prisma.postComment.create({
      data: {
        content,
        userId,
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Update post comment count
    await prisma.post.update({
      where: { id: postId },
      data: {
        comments: {
          increment: 1,
        },
      },
    });

    // Send notification to post author (if not commenting on own post)
    if (post.authorId !== userId) {
      const commenter = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });
      const io = req.app.get('io');
      await createNotification(
        post.authorId,
        'comment',
        'New Comment',
        `${commenter?.name || 'Someone'} commented on your post "${post.title}"`,
        io
      );
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;