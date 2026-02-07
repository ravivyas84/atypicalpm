import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://atypicalpm.com/",
  integrations: [
    starlight({
      title: "Atypical Product Manager",
      pagination: false,
      lastUpdated: true,
      head: [
        {
          tag: "script",
          attrs: {
            src: "https://umami.ravivyas.com/script.js",
            "data-website-id": "bd7c10ec-6a47-4cd2-9a37-32e6ff3c4fda",
            defer: true,
          },
        },
        // Note: OG image tags are now handled by the CustomHead.astro component
      ],
      social: {
        github: "https://github.com/ravivyas84/atypicalpm",
      },
      components: {
        // // Override the default `SocialIcons` component.
        // Footer: './src/components/footer.astro',
        // Override the default Head component for custom metadata
        Head: './src/components/CustomHead.astro',
      },
      sidebar: [
        {
          label: "Meta",
          autogenerate: { directory: "meta" },
        },
        {
          label: "What is Product Management",
          items: [
            "what-is-pm/what-is",
            {
              label: "My Definitions",
              items: [
                "what-is-pm/my-definitions/right-x",
                "what-is-pm/my-definitions/value-driver",
                "what-is-pm/my-definitions/problem-solving-function",
              ],
            },
            {
              label: "Popular Definitions",
              items: [
                "what-is-pm/popular-definitions/shape-up",
                "what-is-pm/popular-definitions/marty-cagan",
              ],
            }
          ],
        },
        {
          label: "PM's Job Is...",
          autogenerate: { directory: "pms-job-is" },
        },
        {
          label: "PM's Job Is Not ...",
          autogenerate: { directory: "pms-job-is-not" },
        },
        {
          label: "Concepts",
          autogenerate: { directory: "concepts" },
        },
        {
          label: "About",
          autogenerate: { directory: "about" },
        },
      ],
    }),
    sitemap(),
  ],
});