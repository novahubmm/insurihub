import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Request tokens
router.post('/request', async (req, res) => {
  try {
    const { amount, price, description } = req.body;
    const userId = (req as any).user.id;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Valid token amount is required',
      });
    }

    if (!price || price <= 0) {
      return res.status(400).json({
        error: 'Valid price is required',
      });
    }

    // Create token request
    const tokenRequest = await prisma.tokenRequest.create({
      data: {
        amount,
        price,
        description: description || `Request for ${amount} tokens`,
        userId,
        status: 'pending',
      },
    });

    res.status(201).json({
      message: 'Token request submitted successfully',
      request: tokenRequest,
    });
  } catch (error) {
    console.error('Token request error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Get user's token requests
router.get('/requests', async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const requests = await prisma.tokenRequest.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    res.json({
      requests,
      pagination: {
        page,
        limit,
        total: await prisma.tokenRequest.count({ where: { userId } }),
      },
    });
  } catch (error) {
    console.error('Get token requests error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Get user's token transactions
router.get('/transactions', async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const transactions = await prisma.tokenTransaction.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    res.json({
      transactions,
      pagination: {
        page,
        limit,
        total: await prisma.tokenTransaction.count({ where: { userId } }),
      },
    });
  } catch (error) {
    console.error('Get token transactions error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Get token balance
router.get('/balance', async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        tokenBalance: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.json({
      balance: user.tokenBalance,
    });
  } catch (error) {
    console.error('Get token balance error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;