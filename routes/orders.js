import { Router } from "express";

export const router = Router();

// 주문 하기
router.post("/", (req, res) => {
  res.json("주문 하기");
});

// 주문 목록 조회
router.get("/", (req, res) => {
  res.json("주문 목록 조회");
});

// 주문 상세 상품 조회
router.get("/:orderId", (req, res) => {
  res.json("주문 상세 상품 조회");
});
