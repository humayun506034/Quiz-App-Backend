import express from "express";
import { questionsController } from "./questions.controller";
import {
  questionsPostValidation,
  questionsUpdateValidation,
} from "./questions.validation";
import validateRequest from "../../middlewares/validateSchema";

const router = express.Router();

router.post(
  "/post_questions",
  validateRequest(questionsPostValidation),
  questionsController.postQuestions
);
router.get("/get_all_questions", questionsController.getAllQuestions);
router.get("/get_single_questions/:id", questionsController.getSingleQuestions);
router.put(
  "/update_questions/:id",
  validateRequest(questionsUpdateValidation),
  questionsController.updateQuestions
);
router.delete("/delete_questions/:id", questionsController.deleteQuestions);

export const questionsRoutes = router;
