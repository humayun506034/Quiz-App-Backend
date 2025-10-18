import { questionModel } from './../question/question.model';
import httpStatus from "http-status";

import { TUser } from "./survey.interface";
import { SurveyResponse } from "./survey.model";
import { AppError } from "../../utils/app_error";

const startSurvey = async (payload: TUser) => {
  const dashboardDomains = [
    "Clinical Risk Index",
    "Psychological Safety Index",
    "Workload & Efficiency",
    "Leadership & Alignment",
    "Satisfaction & Engagement",
  ];

  const randomDomain =
    dashboardDomains[Math.floor(Math.random() * dashboardDomains.length)];

  console.log({ randomDomain });

  const questions = await questionModel.aggregate([
    { $match: { isFollowUp: false, dashboardDomain: randomDomain } },
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

const submitAnswer = async (
  surveyId: string,
  payload: { questionId: string; answerIndex: number }
) => {
  const { questionId, answerIndex } = payload;

  //  Fetch survey & populate main + follow-up questions
  const survey = await SurveyResponse.findById(surveyId).populate(
    "questions followUpQuestions"
  );

  if (!survey) {
    throw new AppError("Survey not found.", httpStatus.NOT_FOUND);
  }

  if (survey.status === "completed") {
    throw new AppError(
      "This survey has already been completed.",
      httpStatus.BAD_REQUEST
    );
  }

  //  Check if question already answered
  const alreadyAnswered = survey.responses.find(
    (res) => res.question.toString() === questionId
  );
  if (alreadyAnswered) {
    throw new AppError(
      "This question has already been answered.",
      httpStatus.BAD_REQUEST
    );
  }

  //  Validate question belongs to this survey
  const allQuestionIds = [
    ...survey.questions.map((q: any) => q._id.toString()),
    ...(survey.followUpQuestions || []).map((q: any) => q._id.toString()),
  ];

  if (!allQuestionIds.includes(questionId)) {
    throw new AppError(
      "Invalid question ID for this survey.",
      httpStatus.BAD_REQUEST
    );
  }

  // Get the question object (main or follow-up)
  const question =
    survey.questions.find((q: any) => q._id.toString() === questionId) ||
    (survey.followUpQuestions.find(
      (q: any) => q._id.toString() === questionId
    ) as any);

  // console.log({question})

  if (!question) {
    throw new AppError("Question not found.", httpStatus.NOT_FOUND);
  }

  //  Calculate score (considering isInverted)
  let score: number;
  if (question.isInverted) {
    score = question.options.length - answerIndex; // Reverse scoring
  } else {
    score = answerIndex + 1; // Normal scoring
  }

  //  Update high-risk count (for main & follow-up questions)
  // if (!survey.highRiskCount) survey.highRiskCount = 0;

  if (question.isInverted === false) {
    if (answerIndex === 0 || answerIndex === 1) {
      survey.highRiskCount = survey.highRiskCount + 1;
    }
  }
  if (question.isInverted === true) {
    if (answerIndex === 2 || answerIndex === 3) {
      survey.highRiskCount = survey.highRiskCount + 1;
    }
  }

  // if (answerIndex === 0 || answerIndex === 1) {
  //   survey.highRiskCount += 1;
  // }

  //  Save the response
  survey.responses.push({
    question: questionId as any,
    answerIndex,
    score,
  });

  //  Add follow-up questions if needed
  if (
    survey.highRiskCount >= 2 &&
    (!survey.followUpQuestions || survey.followUpQuestions.length === 0)
  ) {
    const followUps = await questionModel.aggregate([
      {
        $match: { isFollowUp: true, dashboardDomain: question.dashboardDomain },
      },
    ]);

    // const followUps = await questionModel.find({
    //   isFollowUp: true,
    //   dashboardDomain: question.dashboardDomain,
    // });
    survey.followUpQuestions = followUps.map((q) => q._id);
  }

  //  Mark survey as completed if all questions answered
  const totalQuestionCount =
    survey.questions.length + (survey.followUpQuestions?.length || 0);
  if (survey.responses.length >= totalQuestionCount) {
    survey.status = "completed";
    survey.completedAt = new Date();
  }

  //   Save & return survey (with populated questions)
  await survey.save();

  const populatedSurvey = await SurveyResponse.findById(survey._id)
    .populate("questions")
    .populate("followUpQuestions");

  return populatedSurvey;
};

const getSurveyResult = async (surveyId: string) => {
  const survey = await SurveyResponse.findById(surveyId)
    .populate("questions")
    .populate("followUpQuestions")
    .populate("responses.question");
  if (!survey) throw new AppError("Survey not found", httpStatus.NOT_FOUND);
  const totalQuestionCount =
    survey.questions.length + (survey.followUpQuestions?.length || 0);
  const calculatedWeightedRaw = survey.responses.map((res: any) => {
    const question = res.question as any;
    const weight = question.weight;
    const score = res.score;

    return {
      // questionId: question._id,
      question,
      //If client send answer his weigh is parcent value or not then we need to convert it to parcent value count it a normal value
      weightedValue: (weight / 100) * score,
    };
  });
  return { survey, totalQuestionCount, calculatedWeightedRaw };
};

export const SurveyService = {
  startSurvey,
  submitAnswer,
  getSurveyResult,
};
