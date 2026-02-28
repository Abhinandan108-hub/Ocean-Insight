import mongoose, { Document, Schema, model } from 'mongoose';

export type ResourceType = 'Video' | 'Image' | 'Lesson' | 'Link' | 'PDF';
export type GradeLevel = 'K-2' | '3-5' | '6-8' | '9-12' | 'Higher Ed' | 'General';

export interface IResource extends Document {
  title: string;
  description: string;
  content: string;
  type: ResourceType;
  gradeLevel: GradeLevel;
  subject: string;
  tags: string[];
  mediaUrl?: string;
  thumbnailUrl?: string;
  author: mongoose.Types.ObjectId;
  views: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema: Schema = new Schema<IResource>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['Video', 'Image', 'Lesson', 'Link', 'PDF'],
      required: true 
    },
    gradeLevel: { 
      type: String,
      enum: ['K-2', '3-5', '6-8', '9-12', 'Higher Ed', 'General'],
      required: true
    },
    subject: { type: String, required: true },
    tags: [{ type: String }],
    mediaUrl: { type: String },
    thumbnailUrl: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for search and filtering
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
resourceSchema.index({ author: 1 });
resourceSchema.index({ gradeLevel: 1 });
resourceSchema.index({ subject: 1 });
resourceSchema.index({ type: 1 });
resourceSchema.index({ isPublished: 1 });

const ResourceModel = model<IResource>('Resource', resourceSchema);

export default ResourceModel;