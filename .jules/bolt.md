## 2025-02-25 - Content Engine File IO Bottleneck
**Learning:** In Next.js server-rendered applications, hand-rolled content engines often use a generic \`getAll()\` pattern then filter to find a single item. This causes O(N) disk reads and markdown parsing for every single item page generation/request, which is a massive bottleneck.
**Action:** Always intercept single-item lookups (\`getBySlug\`) to directly read the specific file (e.g. \`path.join(dir, \`\${slug}.md\`)\`) instead of parsing the entire directory first.
