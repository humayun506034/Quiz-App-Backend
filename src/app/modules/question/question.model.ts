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

const QuestionSchema: Schema = new Schema(  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length === 4,
        message: "Four option is required.",
      },
    },
    domain: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 1,
    },
    isInverted: {
      type: Boolean,
      default: false,
    },
    isFollowUp: {
      type: Boolean,
      default: false,
    },
    dashboardDomain: {
      type: String,
      required: true,
      enum: [
        "Clinical Risk Index",
        "Psychological Safety Index",
        "Workload & Efficiency",
        "Leadership & Alignment",
        "Satisfaction & Engagement",
      ],
    },
    dashboardDomainMaxPossibleScore: {
      type: Number,
      required: true,
    },
    dashboardDomainWeight: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const questionModel = mongoose.model<QuestionDocument>(
  "questions",
  QuestionSchema
);
