export const ROLE = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

export const can = (user, action) => {
  if (!user) return false;

  const permissions = {
    create_plan: [ROLE.SUPER_ADMIN],
    edit_plan: [ROLE.SUPER_ADMIN],
    toggle_plan: [ROLE.ADMIN, ROLE.SUPER_ADMIN],
    manage_users: [ROLE.SUPER_ADMIN],
    manage_roles: [ROLE.SUPER_ADMIN],
    approve_withdrawals: [ROLE.SUPER_ADMIN],
    view_admin_pages: [ROLE.ADMIN, ROLE.SUPER_ADMIN],
  };

  return permissions[action]?.includes(user.role);
};
