import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import {
  bulkDeleteSource,
  createSource,
  deleteSource,
  getSource,
  importWebSearch,
  importWebsite,
  importYoutube,
  listSource,
  uploadPdf,
} from "../controllers/source.controller";
import { uploadSinglePdf } from "../middleware/upload.middleware";

export const sourceRoutes = Router({ mergeParams: true });

sourceRoutes.post("/upload", uploadSinglePdf, asyncHandler(uploadPdf));
sourceRoutes.post("/import/website", asyncHandler(importWebsite));
sourceRoutes.post("/import/youtube", asyncHandler(importYoutube));
sourceRoutes.post("/import/web-search", asyncHandler(importWebSearch));

sourceRoutes.get("/", asyncHandler(listSource));
sourceRoutes.post("/", asyncHandler(createSource));
sourceRoutes.post("/bulk-delete", asyncHandler(bulkDeleteSource));
sourceRoutes.get("/:sourceId", asyncHandler(getSource));
sourceRoutes.delete("/:sourceId", asyncHandler(deleteSource));
