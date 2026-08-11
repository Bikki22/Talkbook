import type { Prisma } from "../generated/prisma/client";
import prisma from "../lib/db";

export const artifactSelect = {
  id: true,
  workspaceId: true,
  type: true,
  title: true,
  content: true,
  sourceIds: true,
  status: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type ArtifactRecord = Prisma.LearningArtifactsGetPayload<{
  select: typeof artifactSelect;
}>;

export type CreateArtifactData = {
  workspaceId: string;
  type: ArtifactRecord["type"];
  title: string;
  sourceIds: string[];
  status?: ArtifactRecord["status"];
  metadata?: Prisma.InputJsonValue;
};

export function findArtifactsByWorkspaceId(workspaceId: string) {
  return prisma.learningArtifacts.findMany({
    where: { workspaceId },
    select: artifactSelect,
    orderBy: { createdAt: "desc" },
  });
}

export function findArtifactByIdAndWorkspaceId(
  artifactId: string,
  workspaceId: string,
) {
  return prisma.learningArtifacts.findFirst({
    where: { id: artifactId, workspaceId },
    select: artifactSelect,
  });
}

export function createArtifactRecord(data: CreateArtifactData) {
  return prisma.learningArtifacts.create({
    data: {
      workspaceId: data.workspaceId,
      type: data.type,
      title: data.title,
      sourceIds: data.sourceIds,
      status: data.status ?? "PENDING",
      metadata: data.metadata,
    },
    select: artifactSelect,
  });
}

export function updateArtifactRecord(
  artifactId: string,
  data: {
    title?: string;
    content?: Prisma.InputJsonValue;
    status?: ArtifactRecord["status"];
    metadata?: Prisma.InputJsonValue;
  },
) {
  return prisma.learningArtifacts.update({
    where: { id: artifactId },
    data,
    select: artifactSelect,
  });
}

export async function deleteArtifactRecord(artifactId: string) {
  await prisma.learningArtifacts.delete({
    where: { id: artifactId },
  });
}

export function findArtifactById(artifactId: string) {
  return prisma.learningArtifacts.findUnique({
    where: { id: artifactId },
    select: artifactSelect,
  });
}
