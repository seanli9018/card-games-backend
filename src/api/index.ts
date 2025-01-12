import express, {
  json,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
const app = express();

// Add middleware to parse JSON and URL-encoded data
app.use(json());
// app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Global error handler middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// user
import userRoutes from "./routes/user";
app.use("/user", userRoutes);

// All your routes and middleware
app.get("/", async (_req: Request, res: Response) => {
  res.status(200).json({ message: "API is working!" });
});

export default app; // Export the app to be used in other files
