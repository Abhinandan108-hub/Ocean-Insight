import mongoose, { Document, Schema, model } from 'mongoose';

export interface IPasswordReset extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const passwordResetSchema: Schema = new Schema<IPasswordReset>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for token lookups and cleanup of expired tokens
passwordResetSchema.index({ token: 1 });
passwordResetSchema.index({ userId: 1 });
passwordResetSchema.index({ expiresAt: 1 });

const PasswordResetModel = model<IPasswordReset>('PasswordReset', passwordResetSchema);

export default PasswordResetModel;