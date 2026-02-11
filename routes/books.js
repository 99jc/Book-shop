import { Router } from "express";

export const router = Router();

// 도서 전체 조회
router.get("/", (req, res) => {
  res.json("도서 전체 조회");
});

// 도서 개별 조회
router.get("/:bookId", (req, res) => {
  const id = req.params.bookId;
  res.json("도서 개별 조회");
});

// 카테고리별 도서 목록 조회
router.get("/", (req, res) => {
  const { categoryId, New } = req.query;
  res.json("카테고리별 도서 목록 조회");
});
