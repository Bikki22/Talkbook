import { z } from "zod";
import { CHAT_MODELS } from "../lib/ai-config";
import { workspaceIdParamsSchema } from "./workspace.validator";

export const conversationIdParamSchema = workspaceIdParamsSchema.extend({
  conversationId: z.string().trim().min(1, "Conversation id is required"),
});

export const chatBodySchema = z.object({
  conversationId: z.string().trim().min(1).optional(),
  messages: z.array(z.record(z.string(), z.unknown())).min(1),
  model: z.enum(CHAT_MODELS).optional(),
  websearch: z.boolean().optional(),
});

export type ChatBody = z.infer<typeof chatBodySchema>;

export const createConversationSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
});

export type CreateConversationSchema = z.infer<typeof createConversationSchema>;
