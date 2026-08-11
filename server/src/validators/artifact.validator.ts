import { z } from "zod";
import { workspaceIdParamsSchema } from "./workspace.validator";

export const artifactTypes = [
  "SUMMARY",
  "TAKEAWAYS",
  "FLASHCARD",
  "QUIZ",
  "MINDMAP",
  "REPORT",
] as const;

export const artifactIdParamSchema = workspaceIdParamsSchema.extend({
  artifactId: z.string().trim().min(1, "Artifact id is required"),
});

export const createArtifactSchema = z.object({
  type: z.enum(artifactTypes),
  title: z.string().trim().min(1).max(120).optional(),
  sourceIds: z.array(z.string().trim().min(1)).optional(),
});

export type CreateArtifactInput = z.infer<typeof createArtifactSchema>;
