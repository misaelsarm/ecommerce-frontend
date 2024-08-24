export interface UserInterface {

  _id: string

  name: string,

  email: string,

  phone: string,

  password: string,

  role: {
    label: string,
    value: string
  },

  resetPasswordToken?: any

  resetPasswordExpires?: any,

  comparePassword: any,

  generateJWT: any,

  generatePasswordReset: any,

  active: boolean

  deleted: boolean

  lastLogin: Date,

  createdAt: Date

  verified: boolean

  permissions: any[]  // Store permissions directly

}