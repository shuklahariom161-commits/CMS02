import { Request, Response } from 'express';
import { store } from '../data/store.js';
import { generateId } from '../utils/generateId.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getAllComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;
    let comments = [...store.comments];
    if (userId) {
      comments = comments.filter((c) => c.userId === userId);
    }
    const enriched = comments.map((c) => {
      const post = store.facultyPosts.find((p) => p.id === c.postId);
      return {
        ...c,
        postTitle: post ? post.title : 'Discussion Thread',
        postCategory: post ? post.category : 'Notice',
      };
    });
    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const comments = store.comments.filter((c) => c.postId === postId);
    res.json({ success: true, count: comments.length, data: comments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId, content } = req.body;
    const user = req.user;

    if (!postId || !content) {
      res.status(400).json({ success: false, message: 'PostId and comment content are required.' });
      return;
    }

    const newComment = {
      id: generateId('cmt'),
      postId,
      userId: user?.userId || 'guest_user',
      userName: user?.name || 'College Student',
      userRole: user?.role || 'STUDENT',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    store.comments.push(newComment);

    // Update post comments count
    const post = store.facultyPosts.find((p) => p.id === postId);
    if (post) {
      post.commentsCount = (post.commentsCount || 0) + 1;
    }

    res.status(201).json({ success: true, data: newComment, message: 'Comment posted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const comment = store.comments.find((c) => c.id === id);

    if (!comment) {
      res.status(404).json({ success: false, message: 'Comment not found' });
      return;
    }

    store.comments = store.comments.filter((c) => c.id !== id);

    const post = store.facultyPosts.find((p) => p.id === comment.postId);
    if (post && post.commentsCount > 0) {
      post.commentsCount -= 1;
    }

    res.json({ success: true, message: 'Comment removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = store.comments.findIndex((c) => c.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Comment not found' });
      return;
    }

    store.comments[index] = { ...store.comments[index], ...req.body };
    res.json({ success: true, data: store.comments[index], message: 'Comment updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
