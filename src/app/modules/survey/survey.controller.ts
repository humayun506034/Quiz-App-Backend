import httpStatus from 'http-status';

import { SurveyService } from './survey.service';
import catchAsync from '../../utils/catch_async';
import sendResponse from '../../utils/sendResponse';

const startSurvey = catchAsync(async (req, res) => {
  const result = await SurveyService.startSurvey(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Survey started successfully',
    data: result,
  });
});

const submitAnswer = catchAsync(async (req, res) => {
  const { surveyId } = req.params;
  const result = await SurveyService.submitAnswer(surveyId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Answer submitted successfully',
    data: result,
  });
});

const getSurveyResult = catchAsync(async (req, res) => {
  const { surveyId } = req.params;
  const result = await SurveyService.getSurveyResult(surveyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Survey result fetched successfully',
    data: result,
  });
});
const getAllServeysResult = catchAsync(async (req, res) => {

  const {status}= req.query

  const result = await SurveyService.getAllServeysResult(status as "completed" | "in-progress");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Survey result fetched successfully',
    data: result,
  });
});

export const SurveyController = {
  startSurvey,
  submitAnswer,
  getSurveyResult,
  getAllServeysResult
};
