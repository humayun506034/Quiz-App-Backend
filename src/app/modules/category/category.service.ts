import { categoryModel } from "./category.model";
export const categoryService = {
  async postCategoryIntoDB(data: any) {
    try {
      return await categoryModel.create(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async getAllCategoryFromDB(query: any) {
    try {
    } catch (error) {}
  },
  async getSingleCategoryFromDB(id: string) {
    try {
      return await categoryModel.findById(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
};
