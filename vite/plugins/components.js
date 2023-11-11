import components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'

export default function createComponents() {
    return components({
        resolvers: [
            ElementPlusResolver(),
            IconsResolver()
        ],
        dirs: ['src/components']
    })
}
