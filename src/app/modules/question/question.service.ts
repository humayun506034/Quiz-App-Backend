import { questionModel } from "./question.model";
import { QUESTION_SEARCHABLE_FIELDS } from "./question.constant";

import status from "http-status";

export const questionService = {
  async postQuestionIntoDB(data: any) {},
  async getAllQuestionFromDB(query: any) {
    return await questionModel.find();
  },
  
};
