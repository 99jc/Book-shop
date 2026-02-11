import { Router } from "express";

export const router = Router();

// 회원가입
router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  res.send("회원가입");
});

// 로그인
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  res.send("로그인");
});

// 비밀번호 초기화 요청
router.post("/reset", (req, res) => {
  const { email } = req.body;
  res.send("비밀번호 초기화 요청");
});

// 비밀번호 초기화
router.put("/reset", (req, res) => {
  const { password } = req.body;
  res.send("비밀번호 초기화");
});
