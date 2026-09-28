import { visit } from "unist-util-visit";

/**
 * Open external HTTP(S) links in a new tab while leaving internal links,
 * relative links, anchors, and non-web protocols unchanged.
 */
export function rehypeExternalLinks(options = {}) {
    const siteUrl = options.siteUrl;

    return (tree) => {
        if (!siteUrl) return;

        const siteOrigin = new URL(siteUrl).origin;

        visit(tree, "element", (node) => {
            if (node.tagName !== "a") return;

            const href = node.properties?.href;
            if (typeof href !== "string") return;

            let targetUrl;
            try {
                targetUrl = new URL(href, siteUrl);
            } catch {
                return;
            }

            if (!["http:", "https:"].includes(targetUrl.protocol) || targetUrl.origin === siteOrigin) {
                return;
            }

            node.properties.target = "_blank";

            const existingRel = Array.isArray(node.properties.rel)
                ? node.properties.rel
                : typeof node.properties.rel === "string"
                    ? node.properties.rel.split(/\s+/)
                    : [];

            node.properties.rel = [...new Set([...existingRel, "noopener", "noreferrer"])];
        });
    };
}
