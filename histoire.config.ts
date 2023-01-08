import {defineConfig} from 'histoire'
import {HstSvelte} from '@histoire/plugin-svelte'

export default defineConfig({
    outDir: 'build/histoire',
    routerMode: 'hash',
    setupFile: 'src/stories/setup.ts',
    plugins: [
        HstSvelte(),
    ],
    theme: {
        title: 'leaflet-tracksymbol2',
    },
    tree: {
        groups: [
            {
                id: 'top',
                title: '',
            },
            {
                id: 'usage',
                title: '',
            },
            {
                id: 'layers',
                title: 'Layers',
            }
        ],
    },
    vite: {
        base: '/leaflet-tracksymbol2/',
    },
});
