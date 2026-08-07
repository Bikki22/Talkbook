import {
  createWorkspaceInput,
  updateWorkspaceInput,
} from "../validators/workspace.validator";
import prisma from "../lib/db";

export const workspaceSelect = {
  id: true,
  title: true,
  description: true,
  icon: true,
  defaultModel: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type WorkspaceRecord = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  defaultModel: string;
  createdAt: Date;
  updatedAt: Date;
};

export function findWorkspaceByUserId(userId: string) {
  return prisma.workspace.findMany({
    where: { userId },
    select: workspaceSelect,
    orderBy: { updatedAt: "desc" },
  });
}

export function findWorkspaceByIdAndUserId(
  workspaceId: string,
  userId: string,
) {
  return prisma.workspace.findMany({
    where: { id: workspaceId, userId },
    select: workspaceSelect,
  });
}

export function createWorkspaceRecord(
  userId: string,
  data: createWorkspaceInput,
) {
  return prisma.workspace.create({
    data: {
      userId,
      ...data,
    },
    select: workspaceSelect,
  });
}

export function updateWorkspaceRecord(
  workspaceId: string,
  data: updateWorkspaceInput,
) {
  return prisma.workspace.update({
    where: { id: workspaceId },
    data,
    select: workspaceSelect,
  });
}

export async function deleteWorkspaceRecord(workspaceId: string) {
  await prisma.workspace.delete({
    where: { id: workspaceId },
  });
}
