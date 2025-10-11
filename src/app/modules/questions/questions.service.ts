import { questionsModel } from "./questions.model";
export const questionsService = {
  async postQuestionsIntoDB(data: any) {
    console.log("🚀 ~ postQuestionsIntoDB ~ data:", data);
    try {
      // return await questionsModel.create(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async getAllQuestionsFromDB(query: any) {},
  async getSingleQuestionsFromDB(id: string) {},
  async updateQuestionsIntoDB(data: any) {},
  async deleteQuestionsFromDB(id: string) {},
};
