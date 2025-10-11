import { Router } from "express";
import { questionsRoutes } from "./app/modules/questions/questions.routes";
import { categoryRoutes } from "./app/modules/category/category.routes";

const appRouter = Router();

const moduleRoutes = [
  {
    path: "/questions",
    route: questionsRoutes,
  },
  {
    path:"/category",
    route:categoryRoutes
  }

];
moduleRoutes.forEach((route) => appRouter.use(route.path, route.route));
export default appRouter;
