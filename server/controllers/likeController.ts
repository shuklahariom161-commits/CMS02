import { Response } from 'express';
import { store } from '../data/store.js';
import { generateId } from '../utils/generateId.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user?.userId || 'guest_user';

    const post = store.facultyPosts.find((p) => p.id === postId);
    if (!post) {
      res.status(404).json({ success: false, message: 'Faculty post not found' });
      return;
    }

    const existingLikeIndex = store.likes.findIndex((l) => l.postId === postId && l.userId === userId);

    let liked = false;
    if (existingLikeIndex !== -1) {
      // Unlike
      store.likes.splice(existingLikeIndex, 1);
      post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
      liked = false;
    } else {
      // Like
      store.likes.push({
        id: generateId('like'),
        postId,
        userId,
        createdAt: new Date().toISOString(),
      });
      post.likesCount = (post.likesCount || 0) + 1;
      liked = true;
    }

    res.json({
      success: true,
      liked,
      totalLikes: post.likesCount,
      message: liked ? 'Post liked' : 'Post unliked',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPostLikes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.user?.userId;
    const likes = store.likes.filter((l) => l.postId === postId);
    const hasLiked = userId ? likes.some((l) => l.userId === userId) : false;

    res.json({
      success: true,
      totalLikes: likes.length,
      hasLiked,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
