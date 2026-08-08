import { xid } from "zod";
import {
  createWorkspaceInput,
  updateWorkspaceInput,
} from "../validators/workspace.validator";
import {
  createWorkspaceRecord,
  deleteWorkspaceRecord,
  findWorkspaceByIdAndUserId,
  findWorkspaceByUserId,
  updateWorkspaceRecord,
} from "../repository/workspace.repository";

import { NotFoundError } from "../types/app-error";

export function listWorkspaceByUser(userId: string) {
  return findWorkspaceByUserId(userId);
}

export async function getWorkspaceByIdForUser(
  workspaceId: string,
  userId: string,
) {
  const workspace = await findWorkspaceByIdAndUserId(workspaceId, userId);

  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  return workspace;
}

export function createWorkspaceForUser(
  userId: string,
  input: createWorkspaceInput,
) {
  return createWorkspaceRecord(userId, input);
}

export async function updateWorkspaceForUser(
  workspaceId: string,
  userId: string,
  input: updateWorkspaceInput,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);
  return updateWorkspaceRecord(workspaceId, input);
}

export async function deleteWorkspaceForUser(
  workspaceId: string,
  userId: string,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);

  //   try {
  //     return deleteWorkspaceVectors(workspaceId);
  //   } catch (error) {
  //     console.error("Failed to delete Pinecone namespace", error);
  //   }

  await deleteWorkspaceRecord(workspaceId);
}
