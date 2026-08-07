"use client"

export const ADMIN_ROLES = ["super_admin", "admin", "manager", "coordinator"]

const ALL_ADMIN_ROLES = ADMIN_ROLES
const SUPER_ADMIN = ["super_admin"]
const SUPER_ADMIN_ADMIN = ["super_admin", "admin"]
const SUPER_ADMIN_ADMIN_MANAGER = ["super_admin", "admin", "manager"]
const ADMIN_MANAGER = ["admin", "manager"]

export const ADMIN_MODULE_PERMISSIONS = {
  dashboard: { view: SUPER_ADMIN_ADMIN_MANAGER },
  profile: { view: ALL_ADMIN_ROLES },
  staff: { view: SUPER_ADMIN, create: SUPER_ADMIN, edit: SUPER_ADMIN, delete: SUPER_ADMIN },
  users: { view: SUPER_ADMIN_ADMIN_MANAGER },
  members: {
    view: ALL_ADMIN_ROLES,
    create: ALL_ADMIN_ROLES,
    edit: SUPER_ADMIN_ADMIN_MANAGER,
  },
  donations: { view: SUPER_ADMIN_ADMIN_MANAGER, edit: SUPER_ADMIN_ADMIN_MANAGER },
  events: {
    view: SUPER_ADMIN_ADMIN_MANAGER,
    create: SUPER_ADMIN_ADMIN_MANAGER,
    edit: SUPER_ADMIN_ADMIN_MANAGER,
    delete: SUPER_ADMIN_ADMIN_MANAGER,
  },
  projects: {
    view: SUPER_ADMIN_ADMIN_MANAGER,
    create: SUPER_ADMIN_ADMIN_MANAGER,
    edit: SUPER_ADMIN_ADMIN_MANAGER,
    delete: SUPER_ADMIN_ADMIN_MANAGER,
  },
  crowdfunding: {
    view: SUPER_ADMIN_ADMIN_MANAGER,
    create: SUPER_ADMIN_ADMIN_MANAGER,
    edit: SUPER_ADMIN_ADMIN_MANAGER,
    delete: SUPER_ADMIN_ADMIN_MANAGER,
  },
  gallery: {
    view: SUPER_ADMIN_ADMIN_MANAGER,
    create: SUPER_ADMIN_ADMIN_MANAGER,
    edit: SUPER_ADMIN_ADMIN_MANAGER,
    delete: SUPER_ADMIN_ADMIN_MANAGER,
  },
  news: {
    view: SUPER_ADMIN_ADMIN_MANAGER,
    create: SUPER_ADMIN_ADMIN_MANAGER,
    edit: SUPER_ADMIN_ADMIN_MANAGER,
    delete: SUPER_ADMIN_ADMIN_MANAGER,
  },
  volunteers: { view: ALL_ADMIN_ROLES, edit: ALL_ADMIN_ROLES },
  complaints: { view: SUPER_ADMIN_ADMIN_MANAGER, edit: SUPER_ADMIN_ADMIN_MANAGER },
  contact: { view: SUPER_ADMIN_ADMIN_MANAGER, edit: SUPER_ADMIN_ADMIN_MANAGER },
  team: {
    view: SUPER_ADMIN_ADMIN,
    create: SUPER_ADMIN_ADMIN,
    edit: SUPER_ADMIN_ADMIN,
    delete: SUPER_ADMIN_ADMIN,
  },
  awards: {
    view: SUPER_ADMIN_ADMIN,
    create: SUPER_ADMIN_ADMIN,
    edit: SUPER_ADMIN_ADMIN,
    delete: SUPER_ADMIN_ADMIN,
  },
  reports: {
    view: SUPER_ADMIN_ADMIN_MANAGER,
    create: ADMIN_MANAGER,
    delete: ADMIN_MANAGER,
  },
  downloads: {
    view: SUPER_ADMIN_ADMIN,
    create: SUPER_ADMIN_ADMIN,
    edit: SUPER_ADMIN_ADMIN,
    delete: SUPER_ADMIN_ADMIN,
  },
  certificates: {
    view: SUPER_ADMIN_ADMIN_MANAGER,
    create: SUPER_ADMIN_ADMIN_MANAGER,
    edit: SUPER_ADMIN_ADMIN_MANAGER,
    delete: SUPER_ADMIN_ADMIN_MANAGER,
  },
  appointments: {
    view: SUPER_ADMIN_ADMIN_MANAGER,
    create: SUPER_ADMIN_ADMIN_MANAGER,
  },
  newsletter: {
    view: SUPER_ADMIN_ADMIN_MANAGER,
    create: SUPER_ADMIN_ADMIN_MANAGER,
    delete: SUPER_ADMIN_ADMIN,
  },
  "site-content": {
    view: SUPER_ADMIN_ADMIN,
    create: SUPER_ADMIN_ADMIN,
    edit: SUPER_ADMIN_ADMIN,
    delete: SUPER_ADMIN,
  },
  testimonials: {
    view: SUPER_ADMIN_ADMIN_MANAGER,
    create: SUPER_ADMIN_ADMIN_MANAGER,
    edit: SUPER_ADMIN_ADMIN_MANAGER,
    delete: SUPER_ADMIN_ADMIN_MANAGER,
  },
  backup: { view: SUPER_ADMIN },
}

const ENDPOINT_TO_MODULE = [
  ["/users/public", "users"],
  ["/users", "staff"],
  ["/members", "members"],
  ["/donations", "donations"],
  ["/events", "events"],
  ["/projects", "projects"],
  ["/crowdfunding", "crowdfunding"],
  ["/gallery", "gallery"],
  ["/news", "news"],
  ["/volunteers", "volunteers"],
  ["/complaints", "complaints"],
  ["/contact", "contact"],
  ["/team", "team"],
  ["/awards", "awards"],
  ["/reports", "reports"],
  ["/downloads", "downloads"],
  ["/certificates", "certificates"],
  ["/appointments", "appointments"],
  ["/newsletter", "newsletter"],
  ["/site-content", "site-content"],
  ["/testimonials", "testimonials"],
  ["/admin/backup", "backup"],
]

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role)
}

export function canAccessAdminModule(module, user, action = "view") {
  const role = typeof user === "string" ? user : user?.role
  if (!module || !role) return false

  const modulePermissions = ADMIN_MODULE_PERMISSIONS[module]
  if (!modulePermissions) return isAdminRole(role)

  return Boolean(modulePermissions[action]?.includes(role))
}

export function getAdminModuleForPath(pathname = "") {
  if (pathname === "/admin") return "dashboard"

  const parts = pathname.split("/").filter(Boolean)
  if (parts[0] !== "admin") return null

  return parts[1] || "dashboard"
}

export function getAdminModuleForEndpoint(endpoint = "") {
  return ENDPOINT_TO_MODULE.find(([prefix]) => endpoint.startsWith(prefix))?.[1] || null
}

export function canAccessAdminPath(pathname, user, action = "view") {
  return canAccessAdminModule(getAdminModuleForPath(pathname), user, action)
}

export function getFirstAllowedAdminPath(user, navItems) {
  return navItems.find((item) => canAccessAdminPath(item.href, user))?.href || "/admin/profile"
}
