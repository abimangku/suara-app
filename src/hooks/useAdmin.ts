import { useAppStore } from '@/store/appStore'

export function useAdmin() {
  const isAdminOpen = useAppStore((s) => s.isAdminOpen)
  const openAdmin = useAppStore((s) => s.openAdmin)
  const closeAdmin = useAppStore((s) => s.closeAdmin)

  async function verifyPin(_pin: string): Promise<boolean> {
    // Stub — real PIN verification in Phase 3
    return false
  }

  return { isAdminOpen, openAdmin, closeAdmin, verifyPin }
}
