import { Router } from "express";
import {
  signUp,
  signIn,
  passwordResetRequest,
  passwordReset,
} from "../controller/UserController.js";

export const router = Router();

// 회원가입
router.post("/signup", signUp);

// 로그인
router.post("/signin", signIn);

// 비밀번호 초기화 요청
router.post("/reset", passwordResetRequest);

// 비밀번호 초기화
router.put("/reset", passwordReset);
