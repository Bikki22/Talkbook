import { Router } from "express";
import {
  createMemory,
  deleteMemory,
  listMemories,
  updateMemory,
} from "../controllers/memory.controller";
import { requireAuth } from "../middleware/require-auth.middleware";
import { asyncHandler } from "../utils/async-handler";

export const memoryRoutes = Router();

memoryRoutes.use(requireAuth);

memoryRoutes.get("/", asyncHandler(listMemories));
memoryRoutes.post("/", asyncHandler(createMemory));
memoryRoutes.patch("/:memoryId", asyncHandler(updateMemory));
memoryRoutes.delete("/:memoryId", asyncHandler(deleteMemory));
