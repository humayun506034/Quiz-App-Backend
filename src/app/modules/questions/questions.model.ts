

import { IQuestions } from "./questions.interface";
import mongoose, { Schema } from "mongoose";
const optionSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: Number, required: true },
  },
  { _id: false }
);

const questionSchema = new Schema<IQuestions>(
  {
    questionNumber: { type: Number, required: true, unique: true },
    text: { type: String, required: true },
    options: { type: [optionSchema], required: true },
    domain: { type: String, required: true },
    weight: { type: Number, required: true },
    inverted: { type: Boolean, default: false },
    part: { type: Number, enum: [1, 2], default: 1 }, // 1=Main, 2=Follow-up
    followUpTrigger: { type: String, default: null }, // e.g. "Burnout", "Anxiety"
  },
  { timestamps: true }
);

export const questionsModel = mongoose.model<IQuestions>(
  "Question",
  questionSchema
);
