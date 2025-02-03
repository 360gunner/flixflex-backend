import { Schema, Document } from 'mongoose';

export const MovieSchema = new Schema({
  apiId: { type: String, unique: true },
  title: { type: String },
  description: { type: String },
  releaseDate: { type: Date },
  trailerUrl: { type: String },
  trailer: { type: String },
  details: { type: Object },
});

export class Movie extends Document {
  apiId?: string;
  title?: string;
  description?: string;
  releaseDate?: Date;
  trailerUrl?: string;
  trailer?: string;
  details?: any;
}