import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectDB, dbStatus } from './server/config/db.js';
import { initialSeedData } from './server/seed/seedData.js';
import { store } from './server/data/store.js';

// Import Route Handlers
import authRoutes from './server/routes/authRoutes.js';
import userRoutes from './server/routes/userRoutes.js';
import clubRoutes from './server/routes/clubRoutes.js';
import clubMemberRoutes from './server/routes/clubMemberRoutes.js';
import eventRoutes from './server/routes/eventRoutes.js';
import hiringRoutes from './server/routes/hiringRoutes.js';
import facultyPostRoutes from './server/routes/facultyPostRoutes.js';
import achievementRoutes from './server/routes/achievementRoutes.js';
import commentRoutes from './server/routes/commentRoutes.js';
import likeRoutes from './server/routes/likeRoutes.js';
import notificationRoutes from './server/routes/notificationRoutes.js';
import facultyRoutes from './server/routes/facultyRoutes.js';
import { errorHandler } from './server/middleware/errorMiddleware.js';

const PORT = 3000;

async function startServer() {
  const app = express();

  // Basic Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect Database
  await connectDB();

  // System Health & Information endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'CMS — College Community Management System',
      version: '1.0.0',
      database: dbStatus,
      uptime: process.uptime(),
      counts: {
        users: store.users.length,
        clubs: store.clubs.length,
        events: store.events.length,
        achievements: store.achievements.length,
        hiring: store.hiring.length,
        facultyPosts: store.facultyPosts.length,
      },
    });
  });

  // Database Seed Reset endpoint for convenience
  app.post('/api/seed/reset', (req, res) => {
    store.users = [...initialSeedData.users];
    store.clubs = [...initialSeedData.clubs];
    store.clubMembers = [...initialSeedData.clubMembers];
    store.events = [...initialSeedData.events];
    store.hiring = [...initialSeedData.hiring];
    store.facultyPosts = [...initialSeedData.facultyPosts];
    store.achievements = [...initialSeedData.achievements];
    store.comments = [...initialSeedData.comments];
    store.notifications = [...initialSeedData.notifications];
    res.json({ success: true, message: 'Database reset to initial college seed data.' });
  });

  // Mount API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/clubs', clubRoutes);
  app.use('/api/club-members', clubMemberRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/hiring', hiringRoutes);
  app.use('/api/faculty-posts', facultyPostRoutes);
  app.use('/api/achievements', achievementRoutes);
  app.use('/api/faculty', facultyRoutes);
  app.use('/api/comments', commentRoutes);
  app.use('/api/likes', likeRoutes);
  app.use('/api/notifications', notificationRoutes);

  // Global Error Handler for API routes
  app.use(errorHandler);

  // Vite Middleware for Development or Static serving for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [CMS Server] Running on port ${PORT} (http://localhost:${PORT})`);
    console.log(`🏛️ [CMS Brand] CMS — College Community Management System`);
  });
}

startServer();
