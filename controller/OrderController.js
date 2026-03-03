import { connection as conn } from "../mariadb.js";
import { StatusCodes } from "http-status-codes";

export const order = async (req, res) => {
  const { userId, delivery, items, totalQuantity, totalPrice, firstBookTitle } =
    req.body;
  var sql, values, result;

  try {
    // items를 가지고, 장바구니에서 book_id, quantity 정보 조회
    sql = "SELECT * from cartItems WHERE user_id = ? AND id IN (?)";
    values = [userId, items];
    [result] = await conn.query(sql, values);
    const orderedItems = result;

    // delivery 테이블 삽입
    sql = "INSERT INTO delivery (address, receiver, contact) VALUES(?, ?, ?)";
    values = [delivery.address, delivery.receiver, delivery.contact];
    [result] = await conn.execute(sql, values);
    const delivery_id = result.insertId;

    // orders 테이블 삽입
    sql =
      "INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES(?, ?, ?, ?, ?)";
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];

    [result] = await conn.execute(sql, values);
    const orderId = result.insertId;

    // orderedBook 테이블 삽입
    sql = "INSERT INTO orderedBooks (order_id, book_id, quantity) VALUES ?";
    values = orderedItems.map(({ book_id, quantity }) => [
      orderId,
      book_id,
      quantity,
    ]);

    [result] = await conn.query(sql, [values]);

    result = await deleteCartItems(orderedItems.map(({ id }) => id));

    if (result) {
      return res.status(StatusCodes.CREATED).end();
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const deleteCartItems = async (values) => {
  const sql = "DELETE FROM cartItems WHERE id IN (?)";
  try {
    const [result] = await conn.query(sql, [values]);
    return result.affectedRows;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const getOrders = async (req, res) => {
  const { userId } = req.body;

  try {
    const sql =
      "SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price FROM orders LEFT JOIN delivery ON delivery_id = delivery.id WHERE user_id = ?";

    const [result] = await conn.execute(sql, [userId]);

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

export const getOrderDetail = async (req, res) => {
  const { orderId } = req.params;

  try {
    const sql =
      "SELECT books.id, books.title, books.author, books.price, orderedBooks.quantity FROM books LEFT JOIN orderedBooks ON books.id = orderedBooks.book_id WHERE orderedBooks.order_id = ?";

    const [result] = await conn.execute(sql, [orderId]);

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
