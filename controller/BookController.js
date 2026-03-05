import { connection as conn } from "../mariadb.js";
import { StatusCodes } from "http-status-codes";

export const allBooks = async (req, res) => {
  const { categoryId, news, limit, currentPage } = req.query;
  const userId = req.userId;

  // 추후에 query가 늘어날 수도 있으므로 WHERE절을 query가 존재하면 추가하는걸로 고도화했다.
  var values = [];
  var conditions = [];
  var results;

  const liked_sub_query = userId
    ? ", (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = books.id)) AS liked"
    : "";

  var sql = `SELECT SQL_CALC_FOUND_ROWS books.id, books.title, books.img, category.category_name AS categoryName, books.summary, books.author, books.price, books.pub_date AS pubDate, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes${liked_sub_query} FROM books LEFT JOIN category ON books.category_id = category.id`;

  if (userId) {
    values.push(userId);
  }

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

  if (limit && currentPage) {
    const offset = (currentPage - 1) * limit;
    sql += " LIMIT ? OFFSET ?";
    values.push(parseInt(limit));
    values.push(offset);
  }

  try {
    [results] = await conn.query(sql, values);
    if (results.length) {
      const books = results;
      sql = "SELECT found_rows()";
      [results] = await conn.query(sql);
      return res.status(StatusCodes.OK).json({
        books: books,
        pagination: {
          currentPage: parseInt(currentPage),
          totalCount: results[0]["found_rows()"],
        },
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json(results);
    }
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const bookDetail = async (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const userId = req.userId;
  var sql;
  var values = [];

  const liked_sub_query = userId
    ? ", (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = books.id)) AS liked"
    : "";

  var sql = `SELECT books.id, books.title, books.img, category.category_name AS categoryName, books.summary, books.author, books.price, books.pub_date AS pubDate, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes${liked_sub_query} FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?`;

  if (userId) {
    values.push(userId);
  }
  values.push(bookId);

  try {
    const [results] = await conn.query(sql, values);
    return res.status(StatusCodes.OK).json(results);
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};
