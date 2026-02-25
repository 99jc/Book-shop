import { connection as conn } from "../mariadb.js";
import { StatusCodes } from "http-status-codes";

export const addToCart = async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  const sql =
    "INSERT INTO cartItems (book_id, quantity, user_id) VALUES(?, ?, ?)";

  try {
    const [result] = await conn.query(sql, [bookId, quantity, userId]);

    if (result.affectedRows) {
      return res.status(StatusCodes.CREATED).end();
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

export const getCartItems = async (req, res) => {
  const { userId, selected } = req.body;

  var sql =
    "SELECT cartItems.id, book_id, title, summary, quantity, price FROM cartItems LEFT JOIN books ON cartItems.book_id = books.id WHERE cartItems.user_id = ?";
  var values = [userId];

  if (selected) {
    sql += " AND cartItems.id IN (?)";
    values.push(selected);
  }

  try {
    const [result] = await conn.query(sql, values);

    if (result.length) {
      return res.status(StatusCodes.OK).json(result);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const removeCartItem = async (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const { userId } = req.body;
  const sql = "DELETE FROM cartItems WHERE user_id = ? AND book_id = ?";

  try {
    const [results] = await conn.query(sql, [parseInt(userId), bookId]);

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
