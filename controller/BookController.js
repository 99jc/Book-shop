import { connection as conn } from "../mariadb.js";
import { StatusCodes } from "http-status-codes";

export const allBooks = async (req, res) => {
  const { categoryId, news, limit, currentPage } = req.query;

  const offset = (currentPage - 1) * limit;

  // 추후에 query가 늘어날 수도 있으므로 WHERE절을 query가 존재하면 추가하는걸로 고도화했다.
  var sql =
    "SELECT books.id, books.title, books.img, category.category_name, books.summary, books.author, books.price, books.pub_date FROM books LEFT JOIN category ON books.category_id = category.id";
  var values = [];
  var conditions = [];

  // query에 categoryId가 있다면 비교문을 conditions배열에, 값을 values배열에 삽입한다
  if (categoryId) {
    values.push(categoryId);
    conditions.push("books.category_id = ?");
  }

  // 신간 도서
  if (news && news == "true") {
    conditions.push(
      "books.pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()",
    );
  }

  // 조건이 1개이상 있다면 sql문에 WHERE문을 추가하고 AND조건으로 조건들을 추가한다
  if (conditions.length) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(parseInt(limit));
  values.push(offset);

  try {
    const [results] = await conn.query(sql, values);
    if (results.length) {
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).json(results);
    }
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const bookDetail = async (req, res) => {
  const id = parseInt(req.params.bookId);
  const sql =
    "SELECT books.id, books.title, books.img, category.category_name, books.summary, books.author, books.price, books.pub_date FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?";

  try {
    const [results] = await conn.query(sql, id);
    return res.status(StatusCodes.OK).json(results);
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};
