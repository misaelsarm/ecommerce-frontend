
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

  role: 'admin' | 'customer' | 'user',

  active: boolean

  deleted: boolean

  lastLogin: Date,

  createdAt: Date

  verified: boolean

  permissions: PagePermissions[]  // Store permissions directly

}

