import { Model, Types } from 'mongoose';

export const ageRanges = ['18-25', '25-34', '35-44', '44-54'] as const;
export const seniorityLevels = [
  'Senior Management',
  'Manager / Team Lead',
  'Employee / Individual Contributor',
] as const;
export const locations = ['Block 60', 'Msusundam', 'Head Office'] as const;

export type TUser = {
  department: string;
  gender: 'male' | 'female' | 'other';
  age: (typeof ageRanges)[number];
  seniorityLevel: (typeof seniorityLevels)[number];
  location: (typeof locations)[number];
};

export type TAnswer = {
  question: Types.ObjectId;
  answerIndex: number;
  score: number;
};

export interface ISurveyResponse {
  user: TUser;
  responses: TAnswer[];
  questions: Types.ObjectId[];
  highRiskCount: number;
  status: 'in-progress' | 'completed';
  completedAt?: Date;
  followUpQuestions:Types.ObjectId[];
}

export type SurveyResponseModel = Model<ISurveyResponse, Record<string, unknown>>;
