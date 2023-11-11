import { useMenuBadgeOutsideStore } from '@/store/modules/menuBadge'
const menuBadgeOutsideStore = useMenuBadgeOutsideStore()

export default {
    title: '动态导航标记',
    icon: 'ri:notification-badge-line',
    badge: 'PRO',
    children: [
        {
            title: '点标记',
            badge: () => menuBadgeOutsideStore.dot,
            windowName: 'MenuBadgeExampleDot'
        },
        {
            title: '数字标记',
            badge: () => menuBadgeOutsideStore.number,
            windowName: 'MenuBadgeExampleNumber'
        },
        {
            title: '文字标记',
            badge: () => menuBadgeOutsideStore.text,
            windowName: 'MenuBadgeExampleText'
        }
    ]
}
