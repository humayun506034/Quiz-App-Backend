
    import express from "express";
    import { categoryController } from "./category.controller";
    import { categoryPostValidation,categoryUpdateValidation } from "./category.validation";

    const router = express.Router();
    
    router.post("/post_category",  categoryController.postCategory);

    
    export const categoryRoutes = router;