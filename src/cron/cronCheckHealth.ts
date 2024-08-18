import nodeCron from "node-cron";
import { listDeploymentsStatus } from "../lib/kubernetes";
import { generateHtmlTable } from "../lib/htmlTableGenerator";
// import { generateHtmlTable } from "../lib/htmlTableGenerator";
// import { saveDeploymentStatuses } from "../lib/k8sDeploymentStatus";
// import { sendEmail } from "../lib/mailer";
// import { generateHtmlTable } from "../lib/htmlTableGenerator";
// import { listDeploymentsStatus } from "@/lib/kubernetes";

// nodeCron.schedule('*/15 * * * *', async () => {
//   try {
//     const changes = await saveDeploymentStatuses();
//
//     if (changes.length > 0) {
//       const failedDeployments = changes.filter(deployment => deployment.status !== 'Ready');
//       if (failedDeployments.length > 0) {
//         const htmlTable = generateHtmlTable(failedDeployments);
//         await sendEmail('recipient@example.com', 'Deployment Failure Detected', htmlTable);
//       }
//     }
//   } catch (error) {
//     console.error('Error checking deployment health:', error);
//   }
// });
//

nodeCron.schedule("* * * * *", async () => {
  try {
    const currentHealth = await listDeploymentsStatus();
    if (!currentHealth) {
      console.log("No deployments found");
      return;
    }
    const failedDeployments = currentHealth.filter(
      (deployment) => deployment.status !== "Ready",
    );
    if (failedDeployments.length > 0) {
      const htmlTable = generateHtmlTable(failedDeployments);
      // await sendEmail(
      //   "recipient@example.com",
      //   "Deployment Failure Detected",
      //   htmlTable,
      // );

      console.log(new Date().toString(), failedDeployments);
    }
  } catch (error) {
    console.error("Error checking deployment health:", error);
  }
});
