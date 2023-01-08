import {defineConfig} from 'histoire'
import {HstSvelte} from '@histoire/plugin-svelte'

export default defineConfig({
    outDir: 'build/histoire',
    setupFile: 'src/stories/setup.ts',
    plugins: [
        HstSvelte(),
    ],
    tree: {
        groups: [
            {
                id: 'top',
                title: '',
            },
            {
                id: 'layers',
                title: 'Layers',
            }
        ],
    },
    vite: {
        base: process.env.HISTOIRE_BASE || '/',
    },
});
