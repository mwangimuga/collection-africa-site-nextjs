import type { CollectionConfig } from "payload";
import { publicRead, staffOnly } from "../access";

export const Jobs: CollectionConfig = {
  slug: "jobs",
  labels: { singular: "Vacancy", plural: "Vacancies" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "location", "type", "closesAt", "_status"],
    group: "Recruitment",
  },
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  versions: { drafts: true },
  defaultSort: "-postedAt",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "location", type: "text", required: true, defaultValue: "Nairobi" },
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "Full-time",
      options: ["Full-time", "Contract", "Internship"],
    },
    {
      name: "department",
      type: "select",
      required: true,
      options: ["Operations", "County solutions", "Legal", "Technology", "Analytics", "Support"],
    },
    { name: "postedAt", type: "date", required: true },
    {
      name: "closesAt",
      type: "date",
      admin: { description: "Google expires the listing after this date. Leave blank for rolling roles." },
    },
    { name: "summary", type: "textarea", required: true },
    {
      name: "responsibilities",
      type: "array",
      minRows: 1,
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    {
      name: "requirements",
      type: "array",
      minRows: 1,
      fields: [{ name: "text", type: "textarea", required: true }],
    },
  ],
};
