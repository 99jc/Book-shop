import { Router } from "express";

export const router = Router();

// 좋아요 추가
router.post("/:id", (req, res) => {
  res.json("좋아요 추가");
});

// 좋아요 삭제
router.delete("/:id", (req, res) => {
  res.json("좋아요 삭제");
});
