export const roles = ["admin", "vendor", "user"] as const;

export type Role = (typeof roles)[number];
