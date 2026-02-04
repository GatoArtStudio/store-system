import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import { prisma } from "@store-system/db";
import { csrfMiddleware, verifyCsrfToken } from "./middleware/csrfMiddleware";
import userRouter from "./routes/userRoutes";

dotenv.config();

const app: express.Application = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// csrf middleware
app.use(csrfMiddleware);
app.use(verifyCsrfToken);

// connect to database
async function connectDB() {
  await prisma.$connect();
  console.log(chalk.bgBlue.white("DATABASE CONNECTED"));
}
connectDB().catch((error) => {
  console.log(chalk.red(error));
});

// routes
app.use("/api/v1/auth", userRouter);

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(chalk.bgGreen.black(`listening port: http://localhost:${port} `));
});

export default app;
