import express from "express";
import handler from "./questionHandler";

const questionRouter = express.Router();

questionRouter.get("/", handler.getAll);
questionRouter.post("/", handler.create);
questionRouter.put("/:questionId", handler.update);
questionRouter.get("/:questionId", handler.get);
questionRouter.delete("/:questionId", handler.delete);

export default questionRouter;
