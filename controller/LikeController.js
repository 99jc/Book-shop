import { connection as conn } from "../mariadb.js";
import { StatusCodes } from "http-status-codes";
import "dotenv/config.js";

export const addLike = async (req, res) => {
  const bookId = req.params.id;
  const userId = req.userId;

  const sql = "INSERT INTO likes(user_id, liked_book_id) VALUES(?, ?)";

  try {
    const [result] = await conn.query(sql, [userId, bookId]);

    if (result.affectedRows) {
      return res.status(StatusCodes.OK).end();
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

export const removeLike = async (req, res) => {
  const bookId = parseInt(req.params.id);
  const userId = req.userId;

  const sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";

  try {
    const [results] = await conn.query(sql, [userId, bookId]);

    if (results.affectedRows) {
      return res.status(StatusCodes.OK).end();
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};
