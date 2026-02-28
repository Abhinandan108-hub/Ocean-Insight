import mongoose, { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // hashed password
  role: 'Admin' | 'Educator' | 'User';
  avatar?: string;
  bio?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Educator', 'User'], default: 'User' },
    avatar: { type: String },
    bio: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index for email lookups
userSchema.index({ email: 1 });

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
