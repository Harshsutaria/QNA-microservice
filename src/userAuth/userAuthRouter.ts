import express from "express";
import handler from "./userAuthHandler";

const userAuth = express.Router();

userAuth.post("/signUp", handler.signUp);
userAuth.post("/login", handler.login);

export default userAuth;
