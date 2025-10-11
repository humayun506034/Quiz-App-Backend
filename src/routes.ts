import { Router } from "express";
import { questionsRoutes } from "./app/modules/questions/questions.routes";

const appRouter = Router();

const moduleRoutes = [
  {
    path: "/questions",
    route: questionsRoutes,
  },

];
moduleRoutes.forEach((route) => appRouter.use(route.path, route.route));
export default appRouter;
