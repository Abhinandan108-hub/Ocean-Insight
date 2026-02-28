import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  // Fallback to a sensible local default for development
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ocean_insight';

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

export default connectDB;
