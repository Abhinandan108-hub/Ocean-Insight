import mongoose, { Document, Schema, model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  externalLink?: string;
  liveStreamLink?: string;
  eventImage?: string;
  createdBy: mongoose.Types.ObjectId;
  registeredUsers: mongoose.Types.ObjectId[];
  maxParticipants?: number;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema: Schema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true },
    externalLink: { type: String },
    liveStreamLink: { type: String },
    eventImage: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    registeredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    maxParticipants: { type: Number },
  },
  { timestamps: true }
);

// Indexes
eventSchema.index({ startDate: 1 });
eventSchema.index({ createdBy: 1 });
eventSchema.index({ location: 1 });

const EventModel = model<IEvent>('Event', eventSchema);

export default EventModel;