import { connection as conn } from "../mariadb.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import "dotenv/config.js";

export const signUp = async (req, res) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  const sql = "INSERT INTO users(email, password, salt) VALUES(?, ?, ?)";

  try {
    const [result] = await conn.query(sql, [email, hashPassword, salt]);
    if (result.affectedRows) {
      return res.status(StatusCodes.CREATED).json({ message: result });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * from users WHERE email = ?";

  try {
    const [result] = await conn.query(sql, email);
    const [user] = result;

    var hashPassword;

    if (user) {
      hashPassword = crypto
        .pbkdf2Sync(password, user.salt, 10000, 10, "sha512")
        .toString("base64");
    }

    if (hashPassword && user.password === hashPassword) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.PRIVATE_KEY,
        { expiresIn: "30m", issuer: "admin" },
      );
      res.cookie("token", token, { httpOnly: true });
      return res.status(StatusCodes.OK).json({ message: "로그인 성공" });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const passwordResetRequest = async (req, res) => {
  const { email } = req.body;
  const sql = "SELECT * from users WHERE email = ?";

  try {
    const [result] = await conn.query(sql, email);
    const [user] = result;

    if (user) {
      return res.status(StatusCodes.OK).json({ email: email });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

export const passwordReset = async (req, res) => {
  const { email, password } = req.body;
  const sql = "UPDATE users SET password = ?, salt = ? WHERE email = ?";

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  try {
    const [result] = await conn.query(sql, [hashPassword, salt, email]);

    if (result.affectedRows) {
      return res.status(StatusCodes.OK).end();
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};
