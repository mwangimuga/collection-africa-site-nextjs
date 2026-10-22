import type { CollectionConfig } from "payload";
import { publicRead, staffOnly } from "../access";

export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Content" },
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  upload: {
    staticDir: "public/uploads",
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumb", width: 400, height: 400, position: "centre" },
      { name: "card", width: 800 },
      { name: "hero", width: 1600 },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Describe the image for screen readers and search engines." },
    },
  ],
};
