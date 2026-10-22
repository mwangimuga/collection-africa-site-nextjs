import type { Access } from "payload";

/** Anyone can read published content; only signed-in staff can write. */
export const publicRead: Access = () => true;
export const staffOnly: Access = ({ req }) => Boolean(req.user);

/** Applications are write-only from the public side and readable by staff. */
export const noPublicRead: Access = ({ req }) => Boolean(req.user);
export const publicCreate: Access = () => true;

/** Only an admin can manage other users. */
export const adminOnly: Access = ({ req }) =>
  Boolean(req.user && (req.user as { role?: string }).role === "admin");
