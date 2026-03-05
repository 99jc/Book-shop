import { Router } from "express";
import { allBooks, bookDetail } from "../controller/BookController.js";
import { ensureAuthorization } from "../Auth.js";

export const router = Router();

// (카테고리별) 전체 도서 목록 조회
router.get("/", ensureAuthorization, allBooks);

// 도서 개별 조회
router.get("/:bookId", ensureAuthorization, bookDetail);
