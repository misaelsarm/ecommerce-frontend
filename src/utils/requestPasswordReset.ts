import toast from "react-hot-toast"
import { makeRequest } from "./makeRequest"

export const requestPasswordReset = async (email: string) => {
  try {
    await makeRequest('post', '/api/auth/recover', {
      email
    })
    toast.success('Se envió un correo con las instrucciones para restablecer la contraseña', {
      duration: 6000
    })
  } catch (error) {
    
  }
}