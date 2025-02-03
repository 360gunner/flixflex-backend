import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: String, ref: 'Movie' }],
});

export class User extends Document {
  username: string;
  password: string;
  favorites: string[];
}