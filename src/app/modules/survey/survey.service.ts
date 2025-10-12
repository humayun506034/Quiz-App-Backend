import httpStatus from "http-status";

import { TUser } from "./survey.interface";
import { SurveyResponse } from "./survey.model";
import { AppError } from "../../utils/app_error";
import { questionModel } from "../question/question.model";

const startSurvey = async (payload: TUser) => {
  const questions = await questionModel.aggregate([
    { $match: { isFollowUp: false } },
    { $sample: { size: 5 } },
  ]);

  if (questions.length < 5) {
    throw new AppError(
      "Not enough questions in the database to start the survey.",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  const questionIds = questions.map((q) => q._id);

  const surveyData = {
    user: payload,
    questions: questionIds,
  };

  const result = await SurveyResponse.create(surveyData);

  return {
    survey: result,
    questions,
  };
};



// const submitAnswer = async (
//   surveyId: string,
//   payload: { questionId: string; answerIndex: number }
// ) => {
//   const { questionId, answerIndex } = payload;

//   const survey = await SurveyResponse.findById({ _id: surveyId });

//   if (!survey) {
//     throw new AppError("Survey not found.", httpStatus.NOT_FOUND);
//   }

//   if (survey.status === "completed") {
//     throw new AppError(
//       "This survey has already been completed.",
//       httpStatus.BAD_REQUEST
//     );
//   }

//   const alreadyAnswered = survey.responses.find(
//     (res) => res.question.toString() === questionId
//   );
//   if (alreadyAnswered) {
//     throw new AppError(
//       "This question has already been answered.",
//       httpStatus.BAD_REQUEST
//     );
//   }

//   // Check if the question is part of main or follow-up
//   const allQuestions = [
//     ...survey.questions.map((q) => q.toString()),
//     ...(survey.followUpQuestions || []).map((q) => q.toString())
//   ];

//   if (!allQuestions.includes(questionId)) {
//     throw new AppError("Invalid question ID for this survey.", httpStatus.BAD_REQUEST);
//   }

//   // Count high-risk answers (only for main questions)
//   let highRiskCount = survey.highRiskCount;
//   const isMainQuestion = survey.questions.some((q) => q.toString() === questionId);
//   if (isMainQuestion && (answerIndex === 0 || answerIndex === 1)) {
//     highRiskCount += 1;
//   }

//   const score = answerIndex + 1;

//   survey.responses.push({
//     question: questionId as any,
//     answerIndex,
//     score,
//   });
//   survey.highRiskCount = highRiskCount;

//   // If high risk >= 2 and follow-up questions not already added
//   if (
//     highRiskCount >= 2 &&
//     (!survey.followUpQuestions || survey.followUpQuestions.length === 0)
//   ) {
//     const followUps = await questionModel.aggregate([
//       { $match: { isFollowUp: true } },
//       { $sample: { size: 3 } },
//     ]);
//     survey.followUpQuestions = followUps.map((q) => q._id);
//   }

//   // Check if survey is now complete (main + follow-up)
//   const totalQuestionCount =
//     survey.questions.length + (survey.followUpQuestions?.length || 0);
//   if (survey.responses.length >= totalQuestionCount) {
//     survey.status = "completed";
//     survey.completedAt = new Date();
//   }

//   await survey.save();
//   return survey;
// };



// const getSurveyResult = async (surveyId: string) => {
//   const survey = await SurveyResponse.findById(surveyId).populate(
//     "responses.question"
//   );

//   if (!survey) {
//     throw new AppError("Survey result not found.",httpStatus.NOT_FOUND);
//   }

//   if (survey.status !== "completed") {
//     throw new AppError("Survey is not yet completed.",httpStatus.BAD_REQUEST );
//   }

//   let followUpQuestions = [];
//   if (survey.highRiskCount >= 2) {
//     followUpQuestions = await questionModel.aggregate([
//       { $match: { isFollowUp: true } },
//       { $sample: { size: 3 } },
//     ]);
//   }

//   return {
//     survey,
//     followUpQuestions,
//   };
// };


const submitAnswer = async (
  surveyId: string,
  payload: { questionId: string; answerIndex: number }
) => {
  const { questionId, answerIndex } = payload;

  const survey = await SurveyResponse.findById({ _id: surveyId });

  if (!survey) {
    throw new AppError("Survey not found.", httpStatus.NOT_FOUND);
  }

  if (survey.status === "completed") {
    throw new AppError(
      "This survey has already been completed.",
      httpStatus.BAD_REQUEST
    );
  }

  const alreadyAnswered = survey.responses.find(
    (res) => res.question.toString() === questionId
  );
  if (alreadyAnswered) {
    throw new AppError(
      "This question has already been answered.",
      httpStatus.BAD_REQUEST
    );
  }

  const allQuestions = [
    ...survey.questions.map((q) => q.toString()),
    ...(survey.followUpQuestions || []).map((q) => q.toString())
  ];

  if (!allQuestions.includes(questionId)) {
    throw new AppError("Invalid question ID for this survey.", httpStatus.BAD_REQUEST);
  }

  // Count high-risk only for main questions
  let highRiskCount = survey.highRiskCount;
  const isMainQuestion = survey.questions.some((q) => q.toString() === questionId);
  if (isMainQuestion && (answerIndex === 0 || answerIndex === 1)) {
    highRiskCount += 1;
  }

  const score = answerIndex + 1;

  survey.responses.push({
    question: questionId as any,
    answerIndex,
    score,
  });
  survey.highRiskCount = highRiskCount;

  // Add follow-up questions if needed
  if (
    highRiskCount >= 2 &&
    (!survey.followUpQuestions || survey.followUpQuestions.length === 0)
  ) {
    const followUps = await questionModel.aggregate([
      { $match: { isFollowUp: true } },
      { $sample: { size: 3 } },
    ]);
    survey.followUpQuestions = followUps.map((q) => q._id);
  }

  // Mark complete if all answered
  const totalQuestionCount =
    survey.questions.length + (survey.followUpQuestions?.length || 0);
  if (survey.responses.length >= totalQuestionCount) {
    survey.status = "completed";
    survey.completedAt = new Date();
  }

  await survey.save();

  // ✅ Populate both question sets and response question refs
  const populatedSurvey = await SurveyResponse.findById(survey._id)
    .populate("questions")
    .populate("followUpQuestions")
    // .populate("responses.question"); // if `responses.question` is a ref

  return populatedSurvey;
};


const getSurveyResult = async (surveyId: string) => {
  const survey = await SurveyResponse.findById(surveyId).populate(
    "responses.question"
  );

  if (!survey) {
    throw new AppError("Survey result not found.", httpStatus.NOT_FOUND);
  }

  if (survey.status !== "completed") {
    throw new AppError("Survey is not yet completed.", httpStatus.BAD_REQUEST);
  }

  let followUpQuestions = [];
  if (survey.highRiskCount >= 2) {
    followUpQuestions = await questionModel.aggregate([
      { $match: { isFollowUp: true } },
      { $sample: { size: 3 } },
    ]);
  }

  // Only return the _ids of follow-up questions
  const followUpQuestionIds = followUpQuestions.map(q => q._id);

  return {
    survey: {
      ...survey.toObject(),
      followUpQuestions: followUpQuestionIds,
    },
  };
};


export const SurveyService = {
  startSurvey,
  submitAnswer,
  getSurveyResult,
};
