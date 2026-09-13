import { useEffect } from "react";

/**
 * Per-route document metadata.
 *
 * Every route previously inherited the homepage's title, description and
 * canonical from index.html. The canonical was the damaging one: it told
 * search engines that /console was a duplicate of /, so the page would never
 * be indexed on its own terms.
 *
 * Caveat worth knowing: this runs in the browser. Google executes JavaScript
 * and will see these, but social crawlers (WhatsApp, Slack, LinkedIn) do not,
 * so link previews always use the static tags in index.html. That is fine
 * here because the homepage is what gets shared; it would need prerendering
 * to solve properly, which Firebase Hosting cannot do on the free plan.
 */

const SITE = "https://vibeployed.com";

function upsertMeta(selector: string, attr: string, key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export type Seo = {
  title: string;
  description: string;
  /** Path only, e.g. "/console". Omitted means no canonical change. */
  path?: string;
  /** Keep the page out of search results. Used by 404 and utility pages. */
  noindex?: boolean;
};

export function useSeo({ title, description, path, noindex }: Seo) {
  useEffect(() => {
    document.title = title;
    upsertMeta('meta[name="description"]', "name", "description", description);

    const link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (noindex) {
      /* A noindex page must not claim to be a copy of an indexable one. The
         404 would otherwise keep whatever canonical the previous route left
         behind, pointing every bad URL at the homepage. */
      link?.remove();
    } else if (path) {
      const el = link ?? document.createElement("link");
      el.rel = "canonical";
      el.href = SITE + path;
      if (!link) document.head.appendChild(el);
    }

    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noindex) {
      upsertMeta('meta[name="robots"]', "name", "robots", "noindex, follow");
    } else if (robots) {
      robots.remove();
    }
  }, [title, description, path, noindex]);
}

/**
 * Route-scoped JSON-LD.
 *
 * index.html carries the Organization, WebSite and SoftwareApplication nodes
 * statically, because those never vary and crawlers should see them without
 * running any JavaScript. This hook is for schema that is derived from data
 * the app already owns, where a hand-copied duplicate in index.html would
 * silently drift the moment someone edits the real content.
 *
 * The `id` keys the <script> tag so re-renders replace rather than stack.
 */
export function useJsonLd(id: string, data: unknown) {
  const json = JSON.stringify(data);

  useEffect(() => {
    const attr = `jsonld-${id}`;
    let el = document.head.querySelector<HTMLScriptElement>(`script[data-ld="${attr}"]`);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.dataset.ld = attr;
      document.head.appendChild(el);
    }
    el.textContent = json;

    return () => {
      el?.remove();
    };
  }, [id, json]);
}
