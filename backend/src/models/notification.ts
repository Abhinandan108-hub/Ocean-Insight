import mongoose, { Document, Schema, model } from 'mongoose';

export type NotificationType = 'WelcomeEmail' | 'PasswordReset' | 'CollectionShared' | 'EventReminder' | 'ResourceAdded';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string; // ID of related resource, collection, event, etc.
  read: boolean;
  createdAt: Date;
}

const notificationSchema: Schema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
      type: String, 
      enum: ['WelcomeEmail', 'PasswordReset', 'CollectionShared', 'EventReminder', 'ResourceAdded'],
      required: true 
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedId: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
notificationSchema.index({ userId: 1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ createdAt: -1 });

const NotificationModel = model<INotification>('Notification', notificationSchema);

export default NotificationModel;