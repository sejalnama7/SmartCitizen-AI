import Report from "../models/Report.js";

/** Strips Mongoose internals before sending a report back to the client. */
function formatReport(doc) {
  const obj = doc.toObject();
  delete obj.__v;
  return obj;
}

/**
 * POST /api/report
 * Creates a new complaint. Expects multipart/form-data with fields
 * fullName, mobile, location, category, description, and an optional
 * "image" file (attached by upload.js as req.file before this runs).
 */
async function createReport(req, res, next) {
  try {
    const { fullName, mobile, location, category, description } = req.body;

    const image = req.file
      ? { filename: req.file.filename, url: `/uploads/${req.file.filename}` }
      : { filename: null, url: null };

    const report = new Report({
      fullName,
      mobile,
      location,
      category,
      description,
      image,
    });

    const saved = await report.save();

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully.",
      data: formatReport(saved),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const fieldErrors = Object.fromEntries(
        Object.entries(error.errors).map(([field, fieldError]) => [field, fieldError.message])
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: fieldErrors,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Tracking ID collision — please try submitting again.",
      });
    }

    return next(error);
  }
}

/**
 * GET /api/report/:trackingId
 * Looks up a single complaint by its tracking ID (case-insensitive).
 */
async function getReportByTrackingId(req, res, next) {
  try {
    const { trackingId } = req.params;

    if (!trackingId?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tracking ID is required.",
      });
    }

    const report = await Report.findOne({
      trackingId: trackingId.trim().toUpperCase(),
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: `No report found with tracking ID ${trackingId}.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: formatReport(report),
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/report
 * Lists complaints for the admin dashboard, newest first. Supports:
 *   ?page=1&limit=20              pagination
 *   ?status=Pending                filter by status
 *   ?category=Pothole              filter by category
 *   ?search=main+road               matches fullName, location, trackingId, or description
 */
async function getAllReports(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const { status, category, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search?.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { fullName: regex },
        { location: regex },
        { trackingId: regex },
        { description: regex },
      ];
    }

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Report.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: reports.map(formatReport),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export { createReport, getReportByTrackingId, getAllReports };