import mongoose, { Schema, Document } from "mongoose";

export interface QuestionDocument extends Document {
  id: string;
  question: string;
  options: string[];
  domain: string;
  weight: number;
  isInverted: boolean;
  isFollowUp: boolean;
}

const QuestionSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  domain: { type: String, required: true },
  weight: { type: Number, required: true },
  isInverted: { type: Boolean, required: true },
  isFollowUp: { type: Boolean, required: true },
});

export const questionModel = mongoose.model<QuestionDocument>(
  "questions",
  QuestionSchema
);
