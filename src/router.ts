// importing required modules.
import express from "express";
const router = express.Router();
import userRouter from "./userAuth/userAuthRouter";
import questionRouter from "./question/questionRouter";
import answerRouter from "./answer/answerRouter";

// router for users
router.use("/auth", userRouter);

// router for questions
router.use("/questions", questionRouter);

// router for answers
router.use("/answers", answerRouter);

export default router;
