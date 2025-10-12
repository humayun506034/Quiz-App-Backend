import { Request, Response } from "express";
import { questionService } from "./question.service";
import catchAsync from "../../utils/catch_async";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const getAllQuestion = catchAsync(async (req: Request, res: Response) => {
  const result = await questionService.getAllQuestionFromDB(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

export const questionController = { getAllQuestion };
