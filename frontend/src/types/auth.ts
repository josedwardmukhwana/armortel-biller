export type Role = "admin" | "vendor" | "user";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
