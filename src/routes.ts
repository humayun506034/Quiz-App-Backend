import { Router } from "express";

import { SurveyRoutes } from "./app/modules/survey/survey.routes";
import { questionRoutes } from "./app/modules/question/question.routes";

const appRouter = Router();

const moduleRoutes = [
  {
    path: "/question",
    route: questionRoutes,
  },
  {
    path: "/survey",
    route: SurveyRoutes,
  },
];
moduleRoutes.forEach((route) => appRouter.use(route.path, route.route));
export default appRouter;
