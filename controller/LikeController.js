import { connection as conn } from "../mariadb.js";
import { StatusCodes } from "http-status-codes";

export const addLike = async (req, res) => {
  const liked_book_id = parseInt(req.params.id);
  const { user_id } = req.body;

  const sql = "INSERT INTO likes(user_id, liked_book_id) VALUES(?, ?)";

  try {
    const [result] = await conn.query(sql, [user_id, liked_book_id]);

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
  const liked_book_id = parseInt(req.params.id);
  const { user_id } = req.body;
  const sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";

  try {
    const [results] = await conn.query(sql, [user_id, liked_book_id]);

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
