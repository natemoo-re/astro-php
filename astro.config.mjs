import { defineConfig } from 'astro/config';
import php from './php/index.mjs';

// https://astro.build/config
export default defineConfig({
    integrations: [
        php()
    ]
});
