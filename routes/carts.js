import { Router } from "express";
import {
  addToCart,
  getCartItems,
  removeCartItem,
} from "../controller/CartController.js";

export const router = Router();

// 장바구니 추가
router.post("/", addToCart);

// 장바구니 조회 / 선택된 장바구니 아이템 목록 조회
router.get("/", getCartItems);

// 장바구니 도서 삭제
router.delete("/:bookId", removeCartItem);
