import express, {
  json,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import http from 'http';
import cors from 'cors';
import { initializeSocket } from './socket/socket'; // Import socket logic

const app = express();

// Add middleware to parse JSON and URL-encoded data
app.use(json());
// app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ['http://localhost:3000', 'https://card-games-ecru.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

// Global error handler middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// User
import userRoutes from './api/routes/user';
app.use('/user', userRoutes);

// All routes and middleware
app.get('/health', async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'API is working!' });
});

// Games: Create HTTP server
const server = http.createServer(app);
// Initialize socket.io
initializeSocket(server);

// Enable below comment for local env
// export default app;

// Export to handle vercel serverless function
export default (req: Request, res: Response) => {
  app(req, res);
};
