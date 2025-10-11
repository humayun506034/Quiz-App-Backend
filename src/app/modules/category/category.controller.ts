import { Request, Response } from "express";
import { categoryService } from "./category.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import catchAsync from "../../utils/catch_async";

const postCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.postCategoryIntoDB(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Created successfully",
    data: result,
  });
});

export const categoryController = { postCategory };
