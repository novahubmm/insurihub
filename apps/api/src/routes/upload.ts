import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { uploadImage, uploadFile, calculateFileTokenCost } from '../middleware/upload';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Upload image for post
router.post('/image', authMiddleware, uploadImage.single('image'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const tokenCost = calculateFileTokenCost(req.file.size);

    res.json({
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      tokenCost,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Upload file for chat
router.post('/file', authMiddleware, uploadFile.single('file'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const userId = req.user.id;
    const tokenCost = calculateFileTokenCost(req.file.size);

    // Check user token balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tokenBalance: true },
    });

    if (!user || user.tokenBalance < tokenCost) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: `Insufficient tokens. File requires ${tokenCost} tokens.`,
      });
    }

    // Deduct tokens
    await prisma.user.update({
      where: { id: userId },
      data: {
        tokenBalance: { decrement: tokenCost },
      },
    });

    // Create token transaction
    await prisma.tokenTransaction.create({
      data: {
        type: 'FILE_UPLOAD',
        amount: -tokenCost,
        description: `File upload: ${req.file.originalname}`,
        userId,
      },
    });

    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      url: fileUrl,
      filename: req.file.originalname,
      storedFilename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      tokenCost,
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Delete uploaded file
router.delete('/:filename', authMiddleware, async (req: any, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
