import { defineStore } from 'pinia'
import { piniaStore } from '@/store'

export const useMenuBadgeStore = defineStore(
    // 唯一ID
    'menuBadge',
    {
        state: () => ({
            dot: true,
            number: 10,
            text: '热门'
        }),
        actions: {
            switchDot() {
                this.dot = !this.dot
            },
            setNumber(number) {
                this.number = number
            },
            setText(text) {
                this.text = text
            }
        }
    }
)

export function useMenuBadgeOutsideStore() {
    return useMenuBadgeStore(piniaStore)
}
