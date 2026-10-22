import type { CollectionConfig } from "payload";
import { publicRead, staffOnly } from "../access";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Insight", plural: "Insights" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "date", "_status"],
    group: "Content",
  },
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  versions: { drafts: true },
  defaultSort: "-date",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    {
      name: "description",
      type: "textarea",
      required: true,
      maxLength: 165,
      admin: { description: "This is the snippet Google shows. Aim for 140–158 characters." },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: ["Debt recovery", "County revenue", "Credit management", "Compliance"],
    },
    { name: "date", type: "date", required: true },
    { name: "author", type: "text", required: true, defaultValue: "Collection Africa" },
    {
      name: "readingMinutes",
      type: "number",
      required: true,
      defaultValue: 5,
      admin: { description: "Roughly 220 words a minute." },
    },
    { name: "image", type: "upload", relationTo: "media", required: false },
    {
      name: "body",
      type: "blocks",
      required: true,
      blocks: [
        { slug: "p", labels: { singular: "Paragraph", plural: "Paragraphs" }, fields: [{ name: "text", type: "textarea", required: true }] },
        { slug: "h2", labels: { singular: "Heading", plural: "Headings" }, fields: [{ name: "text", type: "text", required: true }] },
        { slug: "h3", labels: { singular: "Sub-heading", plural: "Sub-headings" }, fields: [{ name: "text", type: "text", required: true }] },
        {
          slug: "ul",
          labels: { singular: "Bullet list", plural: "Bullet lists" },
          fields: [{ name: "items", type: "array", fields: [{ name: "text", type: "textarea", required: true }] }],
        },
        { slug: "quote", labels: { singular: "Pull quote", plural: "Pull quotes" }, fields: [{ name: "text", type: "textarea", required: true }] },
      ],
    },
    {
      name: "keywords",
      type: "array",
      fields: [{ name: "text", type: "text", required: true }],
    },
  ],
};
