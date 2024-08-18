// lib/kubernetes.ts
import * as k8s from "@kubernetes/client-node";
// import { sendEmail } from "./mailer";
import { generateHtmlTable } from "./htmlTableGenerator";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const appsV1Api = kc.makeApiClient(k8s.AppsV1Api);

export const listDeploymentsStatus = async () => {
  try {
    const res = await appsV1Api.listDeploymentForAllNamespaces();
    const deployments = res.body.items.map((deployment) => {
      const name = deployment.metadata?.name || "";
      const namespace = deployment.metadata?.namespace || "";
      const replicas = deployment.status?.replicas || 0;
      const readyReplicas = deployment.status?.readyReplicas || 0;
      const availableReplicas = deployment.status?.availableReplicas || 0;
      const status =
        readyReplicas === replicas && availableReplicas === replicas
          ? "Ready"
          : "Not Ready";

      return {
        name,
        namespace,
        // replicas,
        // readyReplicas,
        // availableReplicas,
        status,
      };
    });
    const failedDeployments = deployments.filter(
      (deployment) => deployment.status === "Not Ready",
    );
    if (failedDeployments.length > 0) {
      // const message = failedDeployments
      //   .map(
      //     (deployment) =>
      //       `Deployment ${deployment.name} in namespace ${deployment.namespace} is not ready.`,
      //   )
      //   .join("\n\n");
      const message = generateHtmlTable(failedDeployments);

      // await sendEmail(
      //   process.env.EMAIL_TO || "",
      //   "Deployment Failure Notification",
      //   message,
      // );
      return deployments;
    }
  } catch (err) {
    console.error("Error fetching deployments:", err);
    throw err;
  }
};
