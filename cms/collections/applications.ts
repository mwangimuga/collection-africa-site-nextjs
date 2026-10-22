import type { CollectionConfig } from "payload";
import { noPublicRead } from "../access";

/**
 * The applicant tracking pipeline.
 *
 * Documents are created server-side by /api/forms/careers, never directly by
 * the browser — create access is closed and the route uses Payload's local
 * API, which bypasses access control by design.
 */
export const Applications: CollectionConfig = {
  slug: "applications",
  labels: { singular: "Application", plural: "Applications" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "status", "createdAt"],
    group: "Recruitment",
    description: "Candidate applications. Personal data — see the retention rule below.",
  },
  access: {
    read: noPublicRead,
    create: () => false,
    update: noPublicRead,
    delete: noPublicRead,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text", required: true },
    { name: "role", type: "text", required: true },
    { name: "location", type: "text" },
    { name: "message", type: "textarea" },
    {
      name: "cv",
      type: "upload",
      relationTo: "media",
      admin: { description: "Attached CV. Also emailed to the careers inbox on submission." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "received",
      options: [
        { label: "Received", value: "received" },
        { label: "Shortlisted", value: "shortlisted" },
        { label: "Interviewed", value: "interviewed" },
        { label: "Offered", value: "offered" },
        { label: "Rejected", value: "rejected" },
      ],
    },
    {
      name: "notes",
      type: "textarea",
      admin: {
        description:
          "Internal notes. The candidate can request a copy of everything held about them under the Data Protection Act — write accordingly.",
      },
    },
    {
      name: "retainUntil",
      type: "date",
      admin: {
        description: "Delete on or before this date unless the candidate agreed to a longer hold. Default is six months.",
      },
    },
  ],
};
