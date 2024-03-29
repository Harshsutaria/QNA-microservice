import express from "express";
import handler from "./answerHandler";

const answerRouter = express.Router();

answerRouter.get("/", handler.getAll);
answerRouter.get("/:answerId", handler.get);
answerRouter.post("/", handler.create);
answerRouter.get("/analytics/:questionId", handler.analytics);

export default answerRouter;
