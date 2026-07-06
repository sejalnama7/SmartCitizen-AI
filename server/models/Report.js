import mongoose from "mongoose";
import crypto from "node:crypto";

/**
 * Must stay in sync with the CATEGORIES list in the frontend's
 * ReportIssue.jsx so the dropdown values are always valid here.
 */
const CATEGORIES = [
  "Garbage Overflow",
  "Water Leakage",
  "Pothole",
  "Street Light",
  "Sewage Problem",
  "Fire Emergency",
  "Ambulance Required",
  "Road Accident",
  "Electricity Issue",
  "Stray Animals",
  "Other",
];

const STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"];

// Matches the client-side pattern in ReportIssue.jsx — Indian mobile numbers.
const MOBILE_PATTERN = /^(\+91[-\s]?)?[6-9]\d{9}$/;

const reportSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      unique: true,
      index: true,
      // Generated in the pre-validate hook below; not required from the client.
    },
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters."],
      maxlength: [100, "Full name must be under 100 characters."],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required."],
      trim: true,
      validate: {
        validator: (value) => MOBILE_PATTERN.test(value),
        message: "Enter a valid 10-digit mobile number.",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required."],
      trim: true,
      minlength: [3, "Location must be at least 3 characters."],
      maxlength: [200, "Location must be under 200 characters."],
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      enum: {
        values: CATEGORIES,
        message: "{VALUE} is not a supported category.",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      minlength: [10, "Description must be at least 10 characters."],
      maxlength: [1000, "Description must be under 1000 characters."],
    },
    image: {
      filename: { type: String, default: null },
      url: { type: String, default: null },
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "Pending",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

/** SC-<8 uppercase alphanumeric chars>, e.g. SC-4F9A2C1D. */
function generateTrackingId() {
  return `SC-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

// Ensure every report gets a unique tracking ID before the first save,
// retrying on the rare chance of a collision.
reportSchema.pre("validate", async function assignTrackingId(next) {
  if (this.trackingId) return next();

  const Report = this.constructor;
  let candidate;
  let attempts = 0;

  do {
    candidate = generateTrackingId();
    attempts += 1;
    // eslint-disable-next-line no-await-in-loop
  } while ((await Report.exists({ trackingId: candidate })) && attempts < 5);

  this.trackingId = candidate;
  next();
});

const Report = mongoose.model("Report", reportSchema);

export default Report;
export { CATEGORIES, STATUSES };