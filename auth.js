import { StatusCodes } from "http-status-codes";
import "dotenv/config.js";
import jwt from "jsonwebtoken";

export function authenticateUser(req, res, next) {
  const receivedJwt = req.headers["authorization"];

  if (!receivedJwt) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인이 필요한 서비스입니다." });
  }

  try {
    const decoded = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
    req.userId = decoded.id;
    return next();
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "잘못된 토큰입니다. " });
    } else if (e instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요.",
      });
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "알수 없는 서버 에러가 발생했습니다." });
    }
  }
}

export function ensureAuthorization(req, res, next) {
  const receivedJwt = req.headers["authorization"];

  if (!receivedJwt) {
    req.userId = undefined;
    return next();
  }

  try {
    const decoded = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
    req.userId = decoded.id;
  } catch (e) {
    req.userId = undefined;
  }
  next();
}
