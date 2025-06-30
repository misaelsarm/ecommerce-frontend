import { useAuthStore } from '@/store/auth'
import { hasPermission } from '@/utils/hasPermission'
import { useRouter } from 'next/router'

const useActions = () => {

  const user = useAuthStore((state) => state.user)

  const { pathname } = useRouter()

  const isAdmin = user.role === 'admin'

  const canEdit = isAdmin ? true : hasPermission(pathname, 'edit', user.permissions)

  const canDelete = isAdmin ? true : hasPermission(pathname, 'delete', user.permissions)

  const canCreate = isAdmin ? true : hasPermission(pathname, 'create', user.permissions)

  return {
    canEdit,
    canDelete,
    canCreate
  }
}

export default useActions