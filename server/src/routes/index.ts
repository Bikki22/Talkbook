import type { Express } from "express";
import { workspaceRoutes } from "./workspace.routes";

export function registerRoutes(app: Express): void {
  app.use("/api/workspaces", workspaceRoutes);
}
