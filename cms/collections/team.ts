import type { CollectionConfig } from "payload";
import { publicRead, staffOnly } from "../access";

export const Team: CollectionConfig = {
  slug: "team",
  labels: { singular: "Team member", plural: "Team" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "role", "order"], group: "Content" },
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "text", required: true },
    { name: "bio", type: "textarea", required: true },
    { name: "photo", type: "upload", relationTo: "media" },
    { name: "linkedin", type: "text" },
    { name: "order", type: "number", defaultValue: 100 },
  ],
};
