import { Schema, Document } from 'mongoose';

export const MovieSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  trailerUrl: { type: String, required: true },
});

export interface Movie extends Document {
  title: string;
  description: string;
  releaseDate: Date;
  trailerUrl: string;
}