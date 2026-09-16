import { Request, Response } from 'express';
import { store } from '../data/store.js';
import { generateId } from '../utils/generateId.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getFacultyPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { facultyId, search } = req.query;
    let results = [...store.facultyPosts];

    if (facultyId) {
      results = results.filter((p) => p.facultyId === facultyId);
    }

    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.facultyName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFacultyPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, category, image, postType, link, department, deadline, prizePool } = req.body;
    const user = req.user;

    if (!title || !content) {
      res.status(400).json({ success: false, message: 'Title and content are required.' });
      return;
    }

    const resolvedCategory =
      category ||
      (postType === 'HACKATHON'
        ? 'Hackathon'
        : postType === 'LINK'
        ? 'Resource Link'
        : 'Academic Notice');

    const newPost = {
      id: generateId('fpost'),
      title,
      content,
      category: resolvedCategory,
      postType: postType || 'NOTICE',
      link: link || '',
      facultyId: user?.userId || 'usr_fac_01',
      facultyName: user?.name || req.body.facultyName || 'Prof. Ramesh Sharma',
      department: department || (user as any)?.department || 'Computer Science & Engineering',
      image: image || '',
      deadline: deadline || '',
      prizePool: prizePool || '',
      likesCount: 0,
      commentsCount: 0,
      isPinned: false,
      createdAt: new Date().toISOString(),
    };

    store.facultyPosts.unshift(newPost);
    res.status(201).json({ success: true, data: newPost, message: 'Faculty post published' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFacultyPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = store.facultyPosts.findIndex((p) => p.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    store.facultyPosts[index] = { ...store.facultyPosts[index], ...req.body };
    res.json({ success: true, data: store.facultyPosts[index], message: 'Post updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFacultyPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    store.facultyPosts = store.facultyPosts.filter((p) => p.id !== id);
    store.comments = store.comments.filter((c) => c.postId !== id);
    store.likes = store.likes.filter((l) => l.postId !== id);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
