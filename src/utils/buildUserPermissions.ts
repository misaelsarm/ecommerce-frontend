import { pageResourceMap } from "./mappings"
import { UserRole } from "./types"

export const buildUserPermissions = (permissions: any[], role: UserRole) => {
  let mapped: any[] = []

  if (permissions) {
    mapped = Object.keys(permissions).map((page) => ({
      page,
      //@ts-ignore
      permissions: permissions[page] || [],
      //@ts-ignore
      resource: pageResourceMap[page]
    }))
  }

  let access = []

  if (role !== 'delivery') {
    access = [...mapped]
  } else {
    access = [
      {
        page: '/admin/my-orders',
        permissions: ['view', 'edit'],
        resource: '/api/admin/orders'
      }
    ]
  }

  return access.filter(role => role.permissions.length > 0);
}