import { Router } from "express";
import { allCategory } from "../controller/CategoryController.js";

export const router = Router();

// 전체 카테고리 목록 조회
router.get("/", allCategory);
