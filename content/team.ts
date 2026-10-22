export type Member = { name: string; role: string; bio: string; photo?: string; linkedin?: string };

/**
 * TODO(client): replace with real names, roles, photos (600x600 webp in
 * /public/team/) and one-line bios. Placeholder entries are intentionally
 * generic — do NOT publish them as-is.
 */
export const leadership: Member[] = [
  { name: "Managing Director", role: "Managing Director", bio: "Pending client copy." },
  { name: "Head of Operations", role: "Head of Operations", bio: "Pending client copy." },
  { name: "Head of Compliance", role: "Head of Compliance", bio: "Pending client copy." },
  { name: "Head of County Solutions", role: "Head of County Solutions", bio: "Pending client copy." },
];

export const milestones = [
  { year: "2001", event: "Collection Africa is founded in Nairobi." },
  { year: "2009", event: "Regional offices open to serve clients outside Nairobi." },
  { year: "2014", event: "County revenue practice established after devolution." },
  { year: "2019", event: "Data protection and compliance framework rebuilt around the Data Protection Act." },
  { year: "2026", event: "Digital collection, SMS and analytics unified on one platform." },
];
