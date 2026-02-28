import mongoose, { Document, Schema, model } from 'mongoose';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface ILog extends Document {
  level: LogLevel;
  message: string;
  timestamp: Date;
  userId?: mongoose.Types.ObjectId;
  endpoint?: string;
  statusCode?: number;
  error?: string;
  metadata?: Record<string, any>;
}

const logSchema: Schema = new Schema<ILog>(
  {
    level: { 
      type: String, 
      enum: ['error', 'warn', 'info', 'debug'],
      required: true 
    },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    endpoint: { type: String },
    statusCode: { type: Number },
    error: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Indexes for querying
logSchema.index({ level: 1 });
logSchema.index({ timestamp: -1 });
logSchema.index({ userId: 1 });

const LogModel = model<ILog>('Log', logSchema);

export default LogModel;