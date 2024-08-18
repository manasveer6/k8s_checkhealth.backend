import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  date,
  unique,
} from "drizzle-orm/pg-core";

export const lastCheckResults = pgTable("last_check_results", {
  id: serial("id").primaryKey(),
  deploymentName: varchar("deployment_name", { length: 255 }).notNull(),
  namespace: varchar("namespace", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  checkedAt: timestamp("checked_at").defaultNow(),
});

export const dailyOutages = pgTable(
  "daily_outages",
  {
    id: serial("id").primaryKey(),
    deploymentName: varchar("deployment_name", { length: 255 }).notNull(),
    namespace: varchar("namespace", { length: 255 }).notNull(),
    outageCount: integer("outage_count").default(0).notNull(),
    date: date("date").notNull(),
  },
  (table) => {
    return {
      // Define unique constraint on deployment_name, namespace, and date
      uniqueConstraint: unique("unique_deployment_outage").on(
        table.deploymentName,
        table.namespace,
        table.date,
      ),
    };
  },
);

// Define the types for the deployment status records
export interface DeploymentStatus {
  id?: number;
  deploymentName: string;
  namespace: string;
  status: string;
  checkedAt?: Date;
}
