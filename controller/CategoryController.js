import { connection as conn } from "../mariadb.js";
import { StatusCodes } from "http-status-codes";

export const allCategory = async (req, res) => {
  const id = parseInt(req.params.bookId);
  const sql = "SELECT * FROM category";

  try {
    const [results] = await conn.query(sql, id);
    return res.status(StatusCodes.OK).json(results);
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
