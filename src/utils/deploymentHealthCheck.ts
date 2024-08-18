import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import {
  lastCheckResults,
  dailyOutages,
  DeploymentStatus,
} from "../drizzle/schema";
import { listDeploymentsStatus } from "../lib/kubernetes";
import { v4 as uuidv4 } from "uuid";

async function checkAndUpdateDeployments() {
  const currentStates = await listDeploymentsStatus(); // Fetch current deployment states
  const lastResults = (await db
    .select()
    .from(lastCheckResults)) as DeploymentStatus[]; // Get last check results

  if (!currentStates) {
    throw new Error("No deployments found");
  }

  for (const current of currentStates) {
    const last = lastResults.find(
      (result: DeploymentStatus) =>
        result.deploymentName === current.name &&
        result.namespace === current.namespace,
    );

    if (last) {
      // Check if the status has changed from "Ready" to "Not Ready"
      if (last.status === "Ready" && current.status !== "Ready") {
        await logOutage(current.name, current.namespace);
      }
    }

    // Update or insert the latest check result
    await db
      .insert(lastCheckResults)
      .values({
        deploymentName: current.name,
        namespace: current.namespace,
        status: current.status,
        checkedAt: new Date(),
      })
      .onConflictDoNothing();
  }
}

async function logOutage(deploymentName: string, namespace: string) {
  const today = new Date().toISOString().slice(0, 10); // Get the current date

  const outageSelect = await db
    .select()
    .from(dailyOutages)
    .where(
      and(
        eq(dailyOutages.deploymentName, deploymentName),
        eq(dailyOutages.namespace, namespace),
        eq(dailyOutages.date, today),
      ),
    );

  const outage = outageSelect[0];

  if (outage) {
    // Increment the outage count
    await db
      .update(dailyOutages)
      .set({ outageCount: outage.outageCount + 1 })
      .where(eq(dailyOutages.id, outage.id));
  } else {
    // Insert a new outage record for today
    await db.insert(dailyOutages).values({
      deploymentName,
      namespace,
      outageCount: 1,
      date: today,
    });
  }
}
