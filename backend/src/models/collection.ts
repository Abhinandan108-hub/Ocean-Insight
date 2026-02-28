import mongoose, { Document, Schema, model } from 'mongoose';

export interface ICollection extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  resourceIds: mongoose.Types.ObjectId[];
  isPublic: boolean;
  shareToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema: Schema = new Schema<ICollection>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    resourceIds: [{ type: Schema.Types.ObjectId, ref: 'Resource' }],
    isPublic: { type: Boolean, default: false },
    shareToken: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

// Indexes
collectionSchema.index({ userId: 1 });
collectionSchema.index({ shareToken: 1 });
collectionSchema.index({ isPublic: 1 });

const CollectionModel = model<ICollection>('Collection', collectionSchema);

export default CollectionModel;