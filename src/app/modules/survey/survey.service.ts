import { questionModel } from "./../question/question.model";
import httpStatus from "http-status";

import { TUser } from "./survey.interface";
import { SurveyResponse } from "./survey.model";
import { AppError } from "../../utils/app_error";

// const startSurvey = async (payload: TUser) => {
//   const dashboardDomains = [
//     "Clinical Risk Index",
//     "Psychological Safety Index",
//     // "Workload & Efficiency",
//     // "Leadership & Alignment",
//     "Satisfaction & Engagement",
//   ];

//   const randomDomain =
//     dashboardDomains[Math.floor(Math.random() * dashboardDomains.length)];

//   // console.log({ randomDomain });

//   const questions = await questionModel.aggregate([
//     { $match: { isFollowUp: false, dashboardDomain: randomDomain } },
//     { $sample: { size: 5 } },
//   ]);

//   if (questions.length < 5) {
//     throw new AppError(
//       "Not enough questions in the database to start the survey.",
//       httpStatus.INTERNAL_SERVER_ERROR
//     );
//   }

//   const questionIds = questions.map((q) => q._id);

//   const surveyData = {
//     user: payload,
//     questions: questionIds,
//   };

//   const result = await SurveyResponse.create(surveyData);

//   return {
//     survey: result,
//     questions,
//   };
// };

// const submitAnswer = async (
//   surveyId: string,
//   payload: { questionId: string; answerIndex: number }
// ) => {
//   const { questionId, answerIndex } = payload;

//   //  Fetch survey & populate main + follow-up questions
//   const survey = await SurveyResponse.findById(surveyId).populate(
//     "questions followUpQuestions"
//   );

//   if (!survey) {
//     throw new AppError("Survey not found.", httpStatus.NOT_FOUND);
//   }

//   if (survey.status === "completed") {
//     throw new AppError(
//       "This survey has already been completed.",
//       httpStatus.BAD_REQUEST
//     );
//   }

//   //  Check if question already answered
//   const alreadyAnswered = survey.responses.find(
//     (res) => res.question.toString() === questionId
//   );
//   if (alreadyAnswered) {
//     throw new AppError(
//       "This question has already been answered.",
//       httpStatus.BAD_REQUEST
//     );
//   }

//   //  Validate question belongs to this survey
//   const allQuestionIds = [
//     ...survey.questions.map((q: any) => q._id.toString()),
//     ...(survey.followUpQuestions || []).map((q: any) => q._id.toString()),
//   ];

//   if (!allQuestionIds.includes(questionId)) {
//     throw new AppError(
//       "Invalid question ID for this survey.",
//       httpStatus.BAD_REQUEST
//     );
//   }

//   // Get the question object (main or follow-up)
//   const question =
//     survey.questions.find((q: any) => q._id.toString() === questionId) ||
//     (survey.followUpQuestions.find(
//       (q: any) => q._id.toString() === questionId
//     ) as any);

//   // console.log({question})

//   if (!question) {
//     throw new AppError("Question not found.", httpStatus.NOT_FOUND);
//   }

//   //  Calculate score (considering isInverted)
//   let score: number;
//   if (question.isInverted) {
//     score = question.options.length - answerIndex; // Reverse scoring
//   } else {
//     score = answerIndex + 1; // Normal scoring
//   }

//   //  Update high-risk count (for main & follow-up questions)
//   // if (!survey.highRiskCount) survey.highRiskCount = 0;

//   if (question.isInverted === false) {
//     if (answerIndex === 0 || answerIndex === 1) {
//       survey.highRiskCount = survey.highRiskCount + 1;
//     }
//   }
//   if (question.isInverted === true) {
//     if (answerIndex === 2 || answerIndex === 3) {
//       survey.highRiskCount = survey.highRiskCount + 1;
//     }
//   }

//   // if (answerIndex === 0 || answerIndex === 1) {
//   //   survey.highRiskCount += 1;
//   // }

//   //  Save the response
//   survey.responses.push({
//     question: questionId as any,
//     answerIndex,
//     score,
//   });

//   //  Add follow-up questions if needed
//   if (
//     survey.highRiskCount >= 2 &&
//     (!survey.followUpQuestions || survey.followUpQuestions.length === 0)
//   ) {
//     const followUps = await questionModel.aggregate([
//       {
//         $match: { isFollowUp: true, dashboardDomain: question.dashboardDomain },
//       },
//     ]);

//     // const followUps = await questionModel.find({
//     //   isFollowUp: true,
//     //   dashboardDomain: question.dashboardDomain,
//     // });
//     survey.followUpQuestions = followUps.map((q) => q._id);
//   }

//   //  Mark survey as completed if all questions answered
//   const totalQuestionCount =
//     survey.questions.length + (survey.followUpQuestions?.length || 0);
//   if (survey.responses.length >= totalQuestionCount) {
//     survey.status = "completed";
//     survey.completedAt = new Date();
//   }

//   //   Save & return survey (with populated questions)
//   await survey.save();

//   const populatedSurvey = await SurveyResponse.findById(survey._id)
//     .populate("questions")
//     .populate("followUpQuestions");

//   return populatedSurvey;
// };

// ===== startSurvey.ts =====



// ===== startSurvey.ts =====






// ===== startSurvey.ts =====


const startSurvey = async (payload: TUser) => {
  const dashboardDomains = [
    "Clinical Risk Index",
    "Psychological Safety Index",
    "Satisfaction & Engagement",
  ];

  const randomDomain =
    dashboardDomains[Math.floor(Math.random() * dashboardDomains.length)];

  // প্রথমে 5টি main question select
  const questions = await questionModel.aggregate([
    { $match: { isFollowUp: false, dashboardDomain: randomDomain } },
    { $sample: { size: 5 } },
  ]);

  if (questions.length < 5)
    throw new AppError(
      "Not enough questions in the database to start the survey.",
      httpStatus.INTERNAL_SERVER_ERROR
    );

  const surveyData = {
    user: payload,
    questions: questions.map((q) => q._id), // 5 main questions assigned
    followUpQuestions: [],
    responses: [],
    highRiskCount: 0,
    status: "in-progress",
  };

  const survey = await SurveyResponse.create(surveyData);

  return {
    survey,
    question: questions[0], // frontend এ প্রথম question
  };
};

// ===== submitAnswer.ts =====
const submitAnswer = async (
  surveyId: string,
  payload: { questionId: string; answerIndex: number }
) => {
  const { questionId, answerIndex } = payload;

  const survey = await SurveyResponse.findById(surveyId).populate(
    "questions followUpQuestions"
  );

  if (!survey) throw new AppError("Survey not found.", httpStatus.NOT_FOUND);
  if (survey.status === "completed")
    throw new AppError("This survey has already been completed.", httpStatus.BAD_REQUEST);

  // Prevent duplicate answer
  if (survey.responses.some((res) => res.question.toString() === questionId))
    throw new AppError("This question has already been answered.", httpStatus.BAD_REQUEST);

  // Find question object
  const question =
    survey.questions.find((q: any) => q._id.toString() === questionId) ||
    survey.followUpQuestions.find((q: any) => q._id.toString() === questionId) as any;

  if (!question) throw new AppError("Question not found.", httpStatus.NOT_FOUND);

  // Score calculation
  const score = question.isInverted ? question.options.length - answerIndex : answerIndex + 1;

  // Update high-risk count
  if (!survey.highRiskCount) survey.highRiskCount = 0;
  if (!question.isInverted) {
    if (answerIndex <= 1) survey.highRiskCount += 1;
  } else {
    if (answerIndex >= 2) survey.highRiskCount += 1;
  }

  // Save response
  survey.responses.push({ question: questionId as any, answerIndex, score });

  // Add follow-up questions if high-risk
  if (
    survey.highRiskCount >= 2 &&
    survey.followUpQuestions.length === 0 &&
    question.isFollowUp === false
  ) {
    const followUps = await questionModel.find({
      isFollowUp: true,
      dashboardDomain: question.dashboardDomain,
    });
    survey.followUpQuestions = followUps.map((q) => q._id) as any;
  }

  // Determine next question sequentially
  const allQuestions = [...survey.questions, ...survey.followUpQuestions];
  const answeredCount = survey.responses.length;
  let nextQuestion = null;

  if (answeredCount < allQuestions.length) {
    nextQuestion = await questionModel.findById(allQuestions[answeredCount]);
  } else {
    survey.status = "completed";
    survey.completedAt = new Date();
  }

  await survey.save();

  return {
    survey,
    nextQuestion, // null হলে survey completed
  };
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
      questionId: question.id,
      question: question.question,
      options: question.options,
      //If client send answer his weigh is parcent value or not then we need to convert it to parcent value count it a normal value
      WRS: (weight / 100) * score,
    };
  });

  const totalWRS = calculatedWeightedRaw.reduce(
    (acc: number, cur: any) => acc + cur.WRS,
    0
  );

  const question = survey.questions[0] as any;
  console.log(question);

  const DomainMaxPossibleScore = question?.dashboardDomainMaxPossibleScore || 1;

  console.log(DomainMaxPossibleScore)

  // const DomainScore = (totalWRS / DomainMaxPossibleScore) * 100;
const DomainScore = ((totalWRS / DomainMaxPossibleScore) * 100).toFixed(4);
  // console.log(survey)
  // console.log(totalWRS)


  // console.log(survey)
  return {
    survey,
    totalQuestionCount,
    totalWRS,
    DomainScore,
    calculatedWeightedRaw,
  };
};

const getAllServeysResult = async (status: "completed" | "in-progress") => {
  let surveys: any;

  if (status) {
    if (status === "completed") {
      surveys = await SurveyResponse.find({ status: "completed" }).select(
        "user highRiskCount status"
      );
    } else if (status === "in-progress") {
      surveys = await SurveyResponse.find({ status: "in-progress" }).select(
        "user highRiskCount status"
      );
    }
  } else {
    surveys = await SurveyResponse.find().select("user highRiskCount status");
  }

  const totalCompletedSurveys = await SurveyResponse.countDocuments({
    status: "completed",
  });

  const totalIncompletedSurveys = await SurveyResponse.countDocuments({
    status: "in-progress",
  });

  const totalSurverys = await SurveyResponse.countDocuments();
  // console.log(totalIncompletedSurveys);
  // console.log(totalCompletedSurveys)
  // .populate("questions")
  // .populate("followUpQuestions")
  // .populate("responses.question");

  // if (!surveys || surveys.length === 0) {
  //   throw new AppError("No surveys found", httpStatus.NOT_FOUND);
  // }

  // const allResults = surveys.map((survey: any) => {
  //   const totalQuestionCount =
  //     (survey.questions?.length || 0) +
  //     (survey.followUpQuestions?.length || 0);

  //   const calculatedWeightedRaw = survey.responses
  //     .filter((res: any) => res?.question) // null question বাদ দিচ্ছি
  //     .map((res: any) => {
  //       const question = res.question as any;
  //       const weight = question?.weight || 0;
  //       const score = res?.score || 0;

  //       return {
  //         questionId: question?._id || null,
  //         question: question?.question || "Unknown Question",
  //         options: question?.options || [],
  //         WRS: (weight / 100) * score,
  //       };
  //     });

  //   const totalWRS = calculatedWeightedRaw.reduce(
  //     (acc: number, cur: any) => acc + (cur.WRS || 0),
  //     0
  //   );

  //   const firstQuestion = survey.questions?.[0] as any;
  //   const DomainMaxPossibleScore =
  //     firstQuestion?.dashboardDomainMaxPossibleScore || 1;

  //   const DomainScore = (totalWRS / DomainMaxPossibleScore) * 100;

  //   return {
  //     surveyId: survey._id,
  //     totalQuestionCount,
  //     totalWRS,
  //     DomainScore,
  //     calculatedWeightedRaw,
  //   };
  // });

  // return allResults;

  return {
    surveys,
    totalSurverys,
    totalCompletedSurveys,
    totalIncompletedSurveys,
  };
};

export const SurveyService = {
  startSurvey,
  submitAnswer,
  getSurveyResult,
  getAllServeysResult,
};
