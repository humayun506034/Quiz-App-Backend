import express from 'express';

import { SurveyController } from './survey.controller';

const router = express.Router();

router.get(
  '/',
  SurveyController.getAllServeysResult,
);

router.post(
  '/start',
  SurveyController.startSurvey,
);

router.post(
  '/:surveyId/submit',
  SurveyController.submitAnswer,
);

router.get(
  '/:surveyId/result',
  SurveyController.getSurveyResult,
);

export const SurveyRoutes = router;
