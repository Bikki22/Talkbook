import { uploadPdfToCloudinary } from "../lib/cloudinary";
import { scrapeWebsite } from "../lib/firecrawl";
import { extractPdfFromBuffer } from "../lib/pdf";
import { enqueSourceProcessing } from "../lib/source-events";
import { fetchYoutubeTranscript } from "../lib/youtube";
import {
  createSourceRecord,
  deleteSourceRecord,
  findSourceByIdAndWorkspaceId,
  findSourcesByWorkspaceId,
} from "../repository/source.ropository";
import { NotFoundError } from "../types/app-error";
import {
  CreateSourceInput,
  ImportWebSearchInput,
  ImportWebsiteInput,
  ImportYoutubeInput,
  ListSourcesQuery,
} from "../validators/source.validator";
import { getWorkspaceByIdForUser } from "./workspace.services";

async function assertWorkspaceAccess(workspaceId: string, userId: string) {
  await getWorkspaceByIdForUser(workspaceId, userId);
}

async function createAndProcessSource(
  data: Parameters<typeof createSourceRecord>[0],
) {
  const source = await createSourceRecord(data);

  await enqueSourceProcessing({
    sourceId: source.id,
    workspaceId: source.workspaceId,
  });

  return source;
}

export const listSourcesForWorkspace = (
  workspaceId: string,
  userId: string,
  filters: ListSourcesQuery = {},
) => {
  assertWorkspaceAccess(workspaceId, userId);
  return findSourcesByWorkspaceId(workspaceId, filters);
};

export const createTextOrMarkdownSource = async (
  workspaceId: string,
  userId: string,
  input: CreateSourceInput,
) => {
  await assertWorkspaceAccess(workspaceId, userId);

  return createAndProcessSource({
    workspaceId,
    type: input.type,
    title: input.title,
    content: input.content,
    status: "PENDING",
  });
};

export async function getSourceForWorkspace(
  workspaceId: string,
  sourceId: string,
  userId: string,
) {
  await assertWorkspaceAccess(workspaceId, userId);

  const source = await findSourceByIdAndWorkspaceId(sourceId, workspaceId);

  if (!source) {
    throw new NotFoundError("Source not found");
  }
  return source;
}

export async function deleteSourceForWorkspace(
  workspaceId: string,
  sourceId: string,
  userId: string,
) {
  await getSourceForWorkspace(workspaceId, sourceId, userId);
  await deleteSourceRecord(sourceId);
}

export const bulkDeleteSourceForWorkspace = async (
  workspaceId: string,
  userId: string,
  sourceIds: string[],
) => {
  await assertWorkspaceAccess(workspaceId, userId);

  for (const sourceId of sourceIds) {
    await deleteSourceForWorkspace(workspaceId, sourceId, userId);
  }
};

export async function importWebsiteSource(
  workspaceId: string,
  userId: string,
  input: ImportWebsiteInput,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);

  const scraped = await scrapeWebsite(input.url);

  return createAndProcessSource({
    workspaceId,
    type: "WEBSITE",
    title: input.title || scraped.title || input.url,
    content: scraped.markdown,
    url: scraped.sourceUrl,
    status: "PENDING",
    metadata: {
      importedFrom: scraped.sourceUrl,
    },
  });
}

export async function uploadPdfSource(
  workspaceId: string,
  userId: string,
  file: Express.Multer.File,
  title?: string,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);

  const upload = await uploadPdfToCloudinary(file.buffer, file.originalname);

  let content: string | null = null;
  let pageCount: number | undefined;

  try {
    const extracted = await extractPdfFromBuffer(file.buffer);
    content = extracted.text;
    pageCount = extracted.pageCount;
  } catch (error) {
    // Inngest will retry extraction from Cloudinary if upload-time parse fails.
  }

  return createAndProcessSource({
    workspaceId,
    type: "PDF",
    title: title?.trim() || file.originalname.replace(/\.pdf$/i, ""),
    content,
    status: "PENDING",
    metadata: {
      fileUrl: upload.secureUrl,
      fileName: upload.originalFilename,
      fileSize: upload.bytes,
      publicId: upload.publicId,
      resourceType: upload.resourceType,
      pageCount,
    },
  });
}

export async function importYoutubeSource(
  workspaceId: string,
  userId: string,
  input: ImportYoutubeInput,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);

  const transcript = await fetchYoutubeTranscript(input.url);

  return createAndProcessSource({
    workspaceId,
    type: "YOUTUBE",
    title: input.title || `YouTube: ${transcript.videoId}`,
    content: transcript.content,
    url: input.url,
    status: "PENDING",
    metadata: {
      videoId: transcript.videoId,
    },
  });
}

export async function importWebSearchSource(
  workspaceId: string,
  userId: string,
  input: ImportWebSearchInput,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);

  return createAndProcessSource({
    workspaceId,
    type: "WEBSITE",
    title: input.title,
    content: input.content,
    url: input.url,
    status: "PENDING",
    metadata: {
      importedFrom: "web-search",
      sourceUrl: input.url,
    },
  });
}
