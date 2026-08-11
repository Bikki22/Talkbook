import type { Express } from "express";
import { workspaceRoutes } from "./workspace.routes";
import { sourceRoutes } from "./source.routes";
import { memoryRoutes } from "./memory.routes";
import { conversationRoutes } from "./chat.routes";

export function registerRoutes(app: Express): void {
  workspaceRoutes.use("/:workspaceId/source", sourceRoutes);
  workspaceRoutes.use("/:workspaceId/conversations", conversationRoutes);
  app.use("/api/workspaces", workspaceRoutes);
  app.use("/api/memory", memoryRoutes);
}
