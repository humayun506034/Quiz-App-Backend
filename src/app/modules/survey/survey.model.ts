import { Schema, model } from "mongoose";
import "../question/question.model"; // Ensure Question model is registered
import {
  ISurveyResponse,
  SurveyResponseModel,
  ageRanges,
  locations,
  seniorityLevels,
} from "./survey.interface";

const userSchema = new Schema({
  department: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  age: { type: String, enum: ageRanges, required: true },
  seniorityLevel: { type: String, enum: seniorityLevels, required: true },
  location: { type: String, enum: locations, required: true },
});

const answerSchema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: "questions", required: true },
  answerIndex: { type: Number, required: true },
  score: { type: Number, required: true },
});

const surveyResponseSchema = new Schema<ISurveyResponse, SurveyResponseModel>(
  {
    user: { type: userSchema, required: true },
    responses: [answerSchema],
    questions: [{ type: Schema.Types.ObjectId, ref: "questions" }],
    highRiskCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
    completedAt: { type: Date },
    followUpQuestions: [{ type: Schema.Types.ObjectId, ref: "questions" }],
  },
  { timestamps: true }
);

export const SurveyResponse = model<ISurveyResponse, SurveyResponseModel>(
  "SurveyResponse",
  surveyResponseSchema
);
