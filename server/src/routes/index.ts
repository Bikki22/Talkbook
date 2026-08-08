import type { Express } from "express";
import { workspaceRoutes } from "./workspace.routes";
import { sourceRoutes } from "./source.routes";

export function registerRoutes(app: Express): void {
  app.use("/:workspaceId/source", sourceRoutes);
  app.use("/api/workspaces", workspaceRoutes);
}
