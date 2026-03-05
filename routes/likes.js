import { Router } from "express";
import { addLike, removeLike } from "../controller/LikeController.js";
import { authenticateUser } from "../auth.js";

export const router = Router();

// 좋아요 추가
router.post("/:id", authenticateUser, addLike);

// 좋아요 삭제
router.delete("/:id", authenticateUser, removeLike);
