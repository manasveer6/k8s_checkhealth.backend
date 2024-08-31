import "dotenv/config";
import nodeCron from "node-cron";
import { listDeploymentsStatus } from "../lib/kubernetes";
import { generateHtmlTable } from "../lib/htmlTableGenerator";
import { checkAndUpdateDeployments } from "../utils/deploymentHealthCheck";
import { PodHealth } from "@/types";
import { sendEmail } from "../lib/mailer";
import {
  sendDailyReminder,
  sendDeploymentFailureAlert,
} from "../lib/mails/mails";
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

nodeCron.schedule("0 8 * * *", async () => {
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

      const recipientEmails = process.env.RECIPIENT_EMAILS?.split(",");
      if (!recipientEmails) {
        console.error("No recipient emails found");
        return;
      }
      recipientEmails.forEach(async (email) => {
        const res = await sendDailyReminder(email, htmlTable);
        console.log(res);
        // await sendEmail(
        //   email,
        //   "Daily reminder for failed deployments",
        //   htmlTable,
        // );
      });
    }
  } catch (error) {
    console.error("Error checking deployment health:", error);
  }
});

nodeCron.schedule("*/15 * * * *", async () => {
  try {
    const newlyFailedDeployments: PodHealth[] =
      await checkAndUpdateDeployments();

    if (newlyFailedDeployments.length > 0) {
      console.log(new Date().toString(), newlyFailedDeployments);
      const htmlTable = generateHtmlTable(newlyFailedDeployments);

      const recipientEmails = process.env.RECIPIENT_EMAILS?.split(",");
      if (!recipientEmails) {
        console.error("No recipient emails found");
        return;
      }
      recipientEmails.forEach(async (email) => {
        const res = await sendDeploymentFailureAlert(email, htmlTable);
        console.log(res);
        // await sendEmail(email, "Deployment Failure Detected", htmlTable);
      });
    } else {
      console.log(new Date().toString(), "No newly failed deployments found");
    }
  } catch (error) {
    console.error("Error checking deployment health:", error);
  }
});
