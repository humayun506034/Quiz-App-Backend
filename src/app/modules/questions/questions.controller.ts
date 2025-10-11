import { Request, Response } from "express";
    import { questionsService } from "./questions.service";

    import status from "http-status";
import catchAsync from "../../utils/catch_async";
import sendResponse from "../../utils/sendResponse";
    
    const postQuestions = catchAsync(async (req: Request, res: Response) => {
      const result = await questionsService.postQuestionsIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllQuestions = catchAsync(async (req: Request, res: Response) => {
      const result = await questionsService.getAllQuestionsFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleQuestions = catchAsync(async (req: Request, res: Response) => {
      const result = await questionsService.getSingleQuestionsFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateQuestions = catchAsync(async (req: Request, res: Response) => {
      const result = await questionsService.updateQuestionsIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteQuestions = catchAsync(async (req: Request, res: Response) => {
      await questionsService.deleteQuestionsFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const questionsController = { postQuestions, getAllQuestions, getSingleQuestions, updateQuestions, deleteQuestions };
    