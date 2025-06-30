import { makeRequest } from "@/utils/makeRequest"

const requestPasswordReset = async () => {
  await makeRequest('post', '/api/auth/recover')
}

export {
  requestPasswordReset
}