import * as k8s from "@kubernetes/client-node";
// import { sendEmail } from "./mailer";
import { generateHtmlTable } from "./htmlTableGenerator";
import { PodHealth } from "@/types";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const appsV1Api = kc.makeApiClient(k8s.AppsV1Api);

export const listDeploymentsStatus = async () => {
  try {
    const res = await appsV1Api.listDeploymentForAllNamespaces();
    const deployments: PodHealth[] = res.body.items.map((deployment) => {
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
        status,
      };
    });
    return deployments;
  } catch (err) {
    console.error("Error fetching deployments:", err);
    throw err;
  }
};
