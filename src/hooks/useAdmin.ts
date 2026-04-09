import { useLiveQuery } from 'dexie-react-hooks'
import { useAppStore } from '@/store/appStore'
import { db } from '@/lib/db'
import { hashPin, verifyPin as verifyPinUtil } from '@/lib/pin'

export function useAdmin() {
  const isAdminOpen = useAppStore((s) => s.isAdminOpen)
  const openAdmin = useAppStore((s) => s.openAdmin)
  const closeAdmin = useAppStore((s) => s.closeAdmin)

  const pinSetting = useLiveQuery(() => db.settings.get('adminPinHash'))
  const hasPin = pinSetting?.value != null

  async function verifyPin(pin: string): Promise<boolean> {
    if (!hasPin || !pinSetting?.value) return false
    return verifyPinUtil(pin, pinSetting.value as string)
  }

  async function setPin(pin: string): Promise<void> {
    const hash = await hashPin(pin)
    await db.settings.put({ key: 'adminPinHash', value: hash, updatedAt: Date.now() })
  }

  return { isAdminOpen, openAdmin, closeAdmin, hasPin, verifyPin, setPin }
}
