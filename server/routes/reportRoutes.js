import { Router } from "express";
import { createReport, getReportByTrackingId, getAllReports } from "../controllers/reportController.js";
import uploadComplaintImage from "../middleware/upload.js";

const router = Router();

// POST /api/report — citizens submit a new complaint (multipart/form-data, optional "image" file)
router.post("/", uploadComplaintImage, createReport);

// GET /api/report — list complaints, newest first (pagination + status/category/search filters)
router.get("/", getAllReports);

// GET /api/report/:trackingId — look up a single complaint by its tracking ID
router.get("/:trackingId", getReportByTrackingId);

export default router;