import express, { Request, Response } from "express";
import { config } from "dotenv";
// import { initCronJobs } from "./cron";
// import { listDeployments } from "./lib";

// Load environment variables from .env file
config();

const app = express();
const port = process.env.PORT || 9087;

// Initialize cron jobs
// initCronJobs();

// Define API routes
// app.get("/api/pods-health", async (req: Request, res: Response) => {
//   try {
//     const deployments = await listDeployments();
//     res.json(deployments);
//   } catch (error) {
//     console.error("Error fetching pod health:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

// Start the server
app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});
