import { Router } from "express";
import { requireAuth } from "../middleware/require-auth.middleware";
import { asyncHandler } from "../utils/async-handler";
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  listWorkspaces,
  updateWorkspace,
} from "../controllers/workspace.controller";

export const workspaceRoutes = Router();

workspaceRoutes.use(requireAuth);

workspaceRoutes.get("/", asyncHandler(listWorkspaces));
workspaceRoutes.post("/", asyncHandler(createWorkspace));
workspaceRoutes.get("/:workspaceId", asyncHandler(getWorkspace));
workspaceRoutes.patch("/:workspaceId", asyncHandler(updateWorkspace));
workspaceRoutes.delete("/:workspaceId", asyncHandler(deleteWorkspace));
