import type { RecordId } from "surrealdb";

export type User = {
  id: RecordId | string | undefined;
  name: string;
  role: string; // A user can have multiple roles. Multiple roles are stored as string separated by comma (",").
  email: string;
  image: string | undefined;
  // createdAt: Date;
  // updatedAt: Date;
  // emailVerified: boolean;
  notification?: object;
  // banned?: boolean;
  // banReason?: string;
  // banExpires?: Date;
};
