import { Router } from "express";

export const router = Router();

// 장바구니 추가
router.post("/", (req, res) => {
  res.json("장바구니 추가");
});

// 장바구니 조회
router.get("/", (req, res) => {
  res.json("장바구니 조회");
});

// 장바구니 도서 삭제
router.delete("/:bookId", (req, res) => {
  res.json("장바구니 도서 삭제");
});

// 장바구니 상품 조회
router.get("/:bookId", (req, res) => {
  res.json("장바구니 상품 조회");
});
