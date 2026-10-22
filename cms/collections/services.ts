import type { CollectionConfig } from "payload";
import { publicRead, staffOnly } from "../access";

/**
 * Field names mirror content/services.ts exactly, so a document from here
 * drops straight into the same rendering code with no transformation.
 */
export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "order", "_status"],
    group: "Content",
  },
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  versions: { drafts: true },
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL segment. Changing this breaks existing links — add a redirect if you do." },
    },
    { name: "order", type: "number", defaultValue: 100, admin: { description: "Lower numbers appear first." } },
    {
      name: "summary",
      type: "textarea",
      required: true,
      maxLength: 160,
      admin: { description: "One line. Used in the nav, cards and the home page ledger." },
    },
    { name: "audience", type: "textarea", required: true, admin: { description: "Who this is actually for." } },
    {
      name: "intro",
      type: "array",
      minRows: 1,
      labels: { singular: "Paragraph", plural: "Intro paragraphs" },
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    {
      name: "process",
      type: "array",
      labels: { singular: "Stage", plural: "Process stages" },
      admin: { description: "Rendered as numbered steps. Only use this for a genuine sequence." },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
    {
      name: "capabilities",
      type: "array",
      labels: { singular: "Capability", plural: "Capabilities" },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
    {
      name: "outcomes",
      type: "array",
      labels: { singular: "Outcome", plural: "Outcomes" },
      fields: [{ name: "text", type: "text", required: true }],
    },
    {
      name: "faqs",
      type: "array",
      labels: { singular: "Question", plural: "FAQs" },
      admin: { description: "These become FAQ structured data and feed the AI assistant. Never state a fee here." },
      fields: [
        { name: "q", type: "text", required: true },
        { name: "a", type: "textarea", required: true },
      ],
    },
    {
      name: "keywords",
      type: "array",
      labels: { singular: "Keyword", plural: "Keywords" },
      fields: [{ name: "text", type: "text", required: true }],
    },
  ],
};
