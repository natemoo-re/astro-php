import { fileURLToPath } from "node:url";
import { PHP } from './vendor/php.mjs'

async function getViteConfiguration() {
  const php = new PHP();
  await php.init();
  return {
    plugins: [
      {
        name: "astro:php",
        async transform(source, id) {
          if (!id.endsWith(".php")) return;
          const output = await php.run(source);
          return {
            code: `export default { 'astro:php': true, code: ${JSON.stringify(output)} }`,
          };
        },
      },
    ],
  };
}

export default function () {
  return {
    name: "@astrojs/php",
    hooks: {
      "astro:config:setup": async ({
        updateConfig,
        addRenderer,
        addPageExtension,
      }) => {
        addRenderer({
          name: "@astrojs/php",
          serverEntrypoint: fileURLToPath(
            new URL("./server.mjs", import.meta.url)
          ),
        });
        updateConfig({
          vite: await getViteConfiguration(),
        });
        addPageExtension(".php");
      },
    },
  };
}
