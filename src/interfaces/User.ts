import { UserRole } from "@/utils/types";

interface PagePermissions {
  page: string;
  permissions: string[];
}
export interface UserInterface {

  _id: string

  name: string,

  email: string,

  phone: string,

  password: string,

  role: UserRole

  active: boolean

  deleted: boolean

  lastLogin: Date,

  createdAt: Date

  verified: boolean

  permissions: PagePermissions[]  // Store permissions directly

}

