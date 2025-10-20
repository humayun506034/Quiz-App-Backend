import express from "express";
import { questionController } from "./question.controller";

const router = express.Router();

router.get("/", questionController.getAllQuestion);

export const questionRoutes = router;
