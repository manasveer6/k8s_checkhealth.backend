import { PodHealth } from "@/types";

export const generateHtmlTable = (deployments: PodHealth[]): string => {
  const rows = deployments
    .map(
      (deployment) => `
    <tr style="border-bottom: 1px solid #fde68a; background-color: #fef3c7; color: #1f2937;">
      <td style="padding: 8px; font-weight: 500;">${deployment.name}</td>
      <td style="padding: 8px;">${deployment.namespace}</td>
      <td style="padding: 8px;">${deployment.status}</td>
    </tr>
  `,
    )
    .join("");

  return `
    <table style="text-align: center; font-size: 14px; font-weight: 300;">
      <thead style="border-bottom: 1px solid #E5E7EB; font-weight: 500;">
        <tr>
          <th style="padding: 8px;">Name</th>
          <th style="padding: 8px;">Namespace</th>
          <th style="padding: 8px;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
};
