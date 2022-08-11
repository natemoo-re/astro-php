import { defineConfig } from 'astro/config';
import php from 'astro-php';

// https://astro.build/config
export default defineConfig({
    integrations: [
        php()
    ]
});
