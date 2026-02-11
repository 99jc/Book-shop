import express from "express";
import "dotenv/config.js";

import { router as userRouter } from "./routes/users.js";
import { router as bookRouter } from "./routes/books.js";
import { router as likeRouter } from "./routes/likes.js";
import { router as cartRouter } from "./routes/carts.js";
import { router as orderRouter } from "./routes/orders.js";

const app = express();
app.listen(process.env.PORT);

app.use(express.json());

app.use("/auth", userRouter);
app.use("/books", bookRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);
