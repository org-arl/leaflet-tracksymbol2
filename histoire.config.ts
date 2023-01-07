import {defineConfig} from 'histoire'
import {HstSvelte} from '@histoire/plugin-svelte'

export default defineConfig({
    setupFile: 'src/stories/setup.ts',
    plugins: [
        HstSvelte(),
    ],
});
