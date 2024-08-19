import express, { Request, Response } from "express";
import { config } from "dotenv";
import { initCronJobs } from "./cron/cronJobs";
import { listDeploymentsStatus } from "./lib/kubernetes";
import cors from "cors";

// Load environment variables from .env file
config();

const app = express();
const port = process.env.PORT || 9087;
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: function(origin, callback) {
      console.log(origin);
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);
// Initialize cron jobs
initCronJobs();

// Define API routes
app.get("/api/pods-health", async (req: Request, res: Response) => {
  console.log("Fetching pod health...");
  try {
    const deployments = await listDeploymentsStatus();
    res.json(deployments);
  } catch (error) {
    console.error("Error fetching pod health:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

// Start the server
app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});
