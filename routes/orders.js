import { Router } from "express";
import {
  getOrderDetail,
  getOrders,
  order,
} from "../controller/OrderController.js";

export const router = Router();

// 주문 하기
router.post("/", order);

// 주문 목록 조회
router.get("/", getOrders);

// 주문 상세 상품 조회
router.get("/:orderId", getOrderDetail);
