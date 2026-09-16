import mongoose from 'mongoose';

export interface DatabaseStatus {
  isConnected: boolean;
  type: 'mongodb' | 'mock-memory';
  message: string;
}

export let dbStatus: DatabaseStatus = {
  isConnected: false,
  type: 'mock-memory',
  message: 'Initializing...',
};

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI || mongoURI.includes('user:pass')) {
    console.warn(
      '⚠️ [CMS Backend] MONGO_URI is not configured with real credentials. Running in local memory-backed simulation mode with Mongoose schemas.'
    );
    dbStatus = {
      isConnected: true,
      type: 'mock-memory',
      message: 'Active in memory-simulated database mode (Configure MONGO_URI in Settings for live cluster)',
    };
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ [CMS Backend] MongoDB Connected: ${conn.connection.host}`);
    dbStatus = {
      isConnected: true,
      type: 'mongodb',
      message: `Connected to MongoDB (${conn.connection.host})`,
    };
  } catch (error: any) {
    console.error(`❌ [CMS Backend] MongoDB connection error: ${error.message}`);
    console.warn('⚡ [CMS Backend] Falling back to memory-backed store so the application runs uninterrupted.');
    dbStatus = {
      isConnected: false,
      type: 'mock-memory',
      message: `Failed live connection (${error.message}). Memory store active.`,
    };
  }
};
