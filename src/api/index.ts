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

const corsOptions = {
  origin: ["http://localhost:3000", "https://card-games-ecru.vercel.app/"],
  allowedHeaders: ["Content-Type", "Authorization"], // Add custom headers here
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

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

// Export to handle local
// export default app;

// Export to handle vercel serverless function
export default (req: Request, res: Response) => {
  app(req, res);
};
