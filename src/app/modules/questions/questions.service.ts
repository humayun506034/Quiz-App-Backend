import { IQuestions } from "./questions.interface";
import { questionsModel } from "./questions.model";
import { questionSearchableFields } from "./questions.constant";


const maxCategoryWeights: Record<string, number> = {
  "Clinical Risk Index": 45,
  "Psychological Safety Index": 30,
  "Workload & Efficiency": 12,
  "Leadership & Alignment": 9,
  "Satisfaction & Engagement": 15
};

export const questionsService = {
  async postQuestionsIntoDB(data: IQuestions) {
    // console.log("🚀 ~ postQuestionsIntoDB ~ data:", data);

    try {
      // Step 1: Get the highest questionNumber in the collection
      const lastQuestion = await questionsModel
        .findOne({})
        .sort({ questionNumber: -1 }) // Sort descending
        .lean(); // Faster read, no mongoose document instance needed

      const nextQuestionNumber = lastQuestion?.questionNumber
        ? lastQuestion.questionNumber + 1
        : 1;
      console.log("🚀 ~ postQuestionsIntoDB ~ nextQuestionNumber:", nextQuestionNumber)

        
      // Step 2: Build payload with new questionNumber
      const payload = {
        ...data,
        questionNumber: nextQuestionNumber,
      };

      // Step 3: Insert into DB
      return await questionsModel.create(payload);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error(
          "An unknown error occurred while posting the question."
        );
      }
    }
  },
  async getAllQuestionsFromDB(query: { searchTerm?: string }) {
    const { searchTerm} = query;

    const andConditions = [];

    if (searchTerm) {
      andConditions.push({
        $or: questionSearchableFields.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }

  

    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

    return await questionsModel.find(whereConditions).lean();
  },
  async getSingleQuestionsFromDB(id: string) {},
  async updateQuestionsIntoDB(data: any) {},
  async deleteQuestionsFromDB(id: string) {},
};
