import { adminAc, defaultAc, userAc } from "better-auth/plugins/admin/access";

export const adminRole = defaultAc.newRole({
  ...adminAc.statements,
});

export const theraRoles = defaultAc.newRole({
  user: ["list"],
});

export const userRole = defaultAc.newRole({
  ...userAc.statements,
});
