import { Permission } from "./types";

// Define the structure of a single permission object
interface PermissionInterface {
  page: string;
  permissions: string[];
}

// Define the type for an array of Permission objects
type UserPermissions = PermissionInterface[];


// Helper function to check if the user has the required permission
export function hasPermission(
  pathname: string,
  requiredPermission: Permission,
  userPermissions: UserPermissions
): boolean {
  // Find the permission object for the given pathname
  const permissionObj = userPermissions?.find(perm => pathname.startsWith(perm.page));

  // If the permission object is found, check if it includes the required permission
  if (permissionObj) {
    return permissionObj.permissions.includes(requiredPermission);
  }

  // If no permission object is found for the pathname, return false
  return false;
}