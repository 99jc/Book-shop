import { Router } from "express";
import {
  getOrderDetail,
  getOrders,
  order,
} from "../controller/OrderController.js";
import { authenticateUser } from "../Auth.js";

export const router = Router();

// 주문 하기
router.post("/", authenticateUser, order);

// 주문 목록 조회
router.get("/", authenticateUser, getOrders);

// 주문 상세 상품 조회
router.get("/:orderId", authenticateUser, getOrderDetail);
