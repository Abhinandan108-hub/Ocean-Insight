import mongoose, { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string; // hashed password
}

const userSchema: Schema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
