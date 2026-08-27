<script lang="ts">
import { onMount, onDestroy } from "svelte";

import type { SearchResult } from "@/global";
import { navigateToPage } from "@utils/navigation";
import { onClickOutside } from "@utils/widget";
import { i18n } from "@i18n/translation";
import I18nKey from "@i18n/i18nKey";
import DropdownPanel from "@/components/common/DropdownPanel.svelte";
import Icon from "@components/common/icon.svelte";


type DevSearchEntry = {
    url: string;
    title: string;
    text: string;
};

let { devSearchEntries = [] }: { devSearchEntries?: DevSearchEntry[] } = $props();

let keywordDesktop = $state("");
let keywordMobile = $state("");
let result: SearchResult[] = $state([]);
let isSearching = $state(false);
let pagefindLoaded = false;
let initialized = $state(false);
let isDesktopSearchExpanded = $state(false);
let debounceTimer: NodeJS.Timeout;

const escapeHtml = (text: string): string => text.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
}[character] ?? character));

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const stripMarkdown = (text: string): string => text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, " $1 ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, " $1 ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*_~>#|{}[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const highlightKeyword = (text: string, keyword: string): string => {
    const matcher = new RegExp(escapeRegExp(keyword), "gi");
    let highlighted = "";
    let lastIndex = 0;

    for (const match of text.matchAll(matcher)) {
        const matchIndex = match.index ?? 0;
        highlighted += escapeHtml(text.slice(lastIndex, matchIndex));
        highlighted += `<mark>${escapeHtml(match[0])}</mark>`;
        lastIndex = matchIndex + match[0].length;
    }

    highlighted += escapeHtml(text.slice(lastIndex));
    return highlighted;
};

const createExcerpt = (text: string, keyword: string): string => {
    const plainText = stripMarkdown(text);
    const normalizedKeyword = keyword.trim().toLocaleLowerCase();
    const matchIndex = plainText.toLocaleLowerCase().indexOf(normalizedKeyword);
    const start = Math.max(0, matchIndex >= 0 ? matchIndex - 45 : 0);
    const end = Math.min(plainText.length, matchIndex >= 0
        ? matchIndex + keyword.length + 75
        : 120);
    const excerpt = plainText.slice(start, end).trim();

    return `${start > 0 ? "…" : ""}${highlightKeyword(excerpt, keyword)}${end < plainText.length ? "…" : ""}`;
};

const searchDevelopmentEntries = (keyword: string): SearchResult[] => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase();
    if (!normalizedKeyword) return [];

    const matches: Array<{ score: number; position: number; result: SearchResult }> = [];

    for (const entry of devSearchEntries) {
        const title = entry.title.toLocaleLowerCase();
        const text = entry.text.toLocaleLowerCase();
        const titlePosition = title.indexOf(normalizedKeyword);
        const textPosition = text.indexOf(normalizedKeyword);

        if (titlePosition < 0 && textPosition < 0) continue;

        const score = title === normalizedKeyword
            ? 0
            : title.startsWith(normalizedKeyword)
                ? 1
                : titlePosition >= 0
                    ? 2
                    : 3;

        matches.push({
            score,
            position: titlePosition >= 0 ? titlePosition : textPosition,
            result: {
                url: entry.url,
                meta: { title: entry.title },
                excerpt: createExcerpt(entry.text, keyword),
            },
        });
    }

    return matches
        .sort((a, b) => a.score - b.score || a.position - b.position)
        .slice(0, 20)
        .map((match) => match.result);
};

const togglePanel = () => {
    const panel = document.getElementById("search-panel");
    panel?.classList.toggle("float-panel-closed");
};

const toggleDesktopSearch = () => {
    isDesktopSearchExpanded = !isDesktopSearchExpanded;
    if (isDesktopSearchExpanded) {
        setTimeout(() => {
            const input = document.getElementById("search-input-desktop") as HTMLInputElement;
            input?.focus();
        }, 0);
    }
};

const collapseDesktopSearch = () => {
    if (!keywordDesktop) {
        isDesktopSearchExpanded = false;
    }
};

const handleBlur = () => {
    // 延迟处理以允许搜索结果的点击事件先于折叠逻辑执行
    setTimeout(() => {
        isDesktopSearchExpanded = false;
        // 仅隐藏面板并折叠，保留搜索关键词和结果以便下次展开时查看
        setPanelVisibility(false, true);
    }, 200);
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
    const panel = document.getElementById("search-panel");
    if (!panel || !isDesktop) return;
    if (show) {
        panel.classList.remove("float-panel-closed");
    } else {
        panel.classList.add("float-panel-closed");
    }
};

const closeSearchPanel = (): void => {
    const panel = document.getElementById("search-panel");
    if (panel) {
        panel.classList.add("float-panel-closed");
    }
    // 清空搜索关键词和结果
    keywordDesktop = "";
    keywordMobile = "";
    result = [];
};

const handleResultClick = (event: Event, url: string): void => {
    event.preventDefault();
    closeSearchPanel();
    navigateToPage(url);
};

const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
    if (!keyword) {
        setPanelVisibility(false, isDesktop);
        result = [];
        return;
    }
    if (!initialized) {
        return;
    }
    isSearching = true;
    try {
        let searchResults: SearchResult[] = [];
        if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
            const response = await window.pagefind.search(keyword);
            searchResults = await Promise.all(
                response.results.map((item) => item.data()),
            );
        } else if (import.meta.env.DEV) {
            searchResults = searchDevelopmentEntries(keyword);
        } else {
            searchResults = [];
            console.error("Pagefind is not available in production environment.");
        }
        result = searchResults;
        setPanelVisibility(result.length > 0, isDesktop);
    } catch (error) {
        console.error("Search error:", error);
        result = [];
        setPanelVisibility(false, isDesktop);
    } finally {
        isSearching = false;
    }
};

const handleClickOutside = (event: MouseEvent) => {
    const panel = document.getElementById("search-panel");
    if (!panel || panel.classList.contains("float-panel-closed")) {
        return;
    }
    onClickOutside(event, "search-panel", ["search-switch", "search-bar"], () => {
        const panel = document.getElementById("search-panel");
        panel?.classList.add("float-panel-closed");
        isDesktopSearchExpanded = false;
    });
};

onMount(() => {
    document.addEventListener("click", handleClickOutside);
    const initializeSearch = () => {
        initialized = true;
        pagefindLoaded =
            typeof window !== "undefined" &&
            !!window.pagefind &&
            typeof window.pagefind.search === "function";
        console.log("Pagefind status on init:", pagefindLoaded);
    };
    if (import.meta.env.DEV) {
        initializeSearch();
    } else {
        document.addEventListener("pagefindready", () => {
            console.log("Pagefind ready event received.");
            initializeSearch();
        });
        document.addEventListener("pagefindloaderror", () => {
            console.warn(
                "Pagefind load error event received. Search functionality will be limited.",
            );
            initializeSearch(); // Initialize with pagefindLoaded as false
        });
        // Fallback in case events are not caught or pagefind is already loaded by the time this script runs
        setTimeout(() => {
            if (!initialized) {
                console.log("Fallback: Initializing search after timeout.");
                initializeSearch();
            }
        }, 2000); // Adjust timeout as needed
    }
});

$effect(() => {
    if (initialized) {
        const keyword = keywordDesktop || keywordMobile;
        const isDesktop = !!keywordDesktop || isDesktopSearchExpanded;
        
        clearTimeout(debounceTimer);
        if (keyword) {
            debounceTimer = setTimeout(() => {
                search(keyword, isDesktop);
            }, 300);
        } else {
            result = [];
            setPanelVisibility(false, isDesktop);
        }
    }
});

$effect(() => {
    if (typeof document !== 'undefined') {
        const navbar = document.getElementById('navbar');
        if (isDesktopSearchExpanded) {
            navbar?.classList.add('is-searching');
        } else {
            navbar?.classList.remove('is-searching');
        }
    }
});

onDestroy(() => {
    if (typeof document !== 'undefined') {
        document.removeEventListener("click", handleClickOutside);
        const navbar = document.getElementById('navbar');
        navbar?.classList.remove('is-searching');
    }
    clearTimeout(debounceTimer);
});
</script>

<!-- search bar for desktop view (collapsed by default) -->
<div
    id="search-bar"
    class="hidden lg:flex transition-all items-center h-11 rounded-lg
        {isDesktopSearchExpanded ? 'bg-black/4 hover:bg-black/6 focus-within:bg-black/6 dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10' : 'btn-plain scale-animation active:scale-90'}
        {isDesktopSearchExpanded ? 'w-48' : 'w-11'}"
    role="button"
    tabindex="0"
    aria-label="Search"
    onmouseenter={() => {if (!isDesktopSearchExpanded) toggleDesktopSearch()}}
    onmouseleave={collapseDesktopSearch}
>
    <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none {isDesktopSearchExpanded ? 'ml-3' : 'left-1/2 -translate-x-1/2'} transition my-auto {isDesktopSearchExpanded ? 'text-black/30 dark:text-white/30' : ''}"></Icon>
    <input id="search-input-desktop" placeholder="{i18n(I18nKey.search)}" bind:value={keywordDesktop}
        onfocus={() => {if (!isDesktopSearchExpanded) toggleDesktopSearch(); search(keywordDesktop, true)}}
        onblur={handleBlur}
        class="transition-all pl-10 text-sm bg-transparent outline-0
            h-full {isDesktopSearchExpanded ? 'w-36' : 'w-0'} text-black/50 dark:text-white/50"
    >
</div>

<!-- toggle btn for phone/tablet view -->
<button onclick={togglePanel} aria-label="Search Panel" id="search-switch"
        class="btn-plain scale-animation lg:hidden! rounded-lg w-11 h-11 active:scale-90 flex items-center justify-center">
    <Icon icon="material-symbols:search" class="text-[1.25rem]"></Icon>
</button>

<!-- search panel -->
<DropdownPanel
        id="search-panel"
        class="float-panel-closed absolute md:w-120 top-20 left-4 md:left-[unset] right-4 z-50 search-panel"
>
    <!-- search bar inside panel for phone/tablet -->
    <div id="search-bar-inside" class="flex relative lg:hidden transition-all items-center h-11 rounded-xl
      bg-black/4 hover:bg-black/6 focus-within:bg-black/6
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
  ">
        <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
        <input placeholder="Search" bind:value={keywordMobile}
               class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
               focus:w-60 text-black/50 dark:text-white/50"
        >
    </div>
    <!-- search results -->
    {#each result as item}
        <a href={item.url}
           onclick={(e) => handleResultClick(e, item.url)}
           class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
       rounded-xl text-lg px-3 py-2 hover:bg-(--btn-plain-bg-hover) active:bg-(--btn-plain-bg-active)">
            <div class="transition text-90 inline-flex font-bold group-hover:text-(--primary)">
                {item.meta.title}<Icon icon="fa6-solid:chevron-right" class="transition text-[0.75rem] translate-x-1 my-auto text-(--primary)"></Icon>
            </div>
            <div class="transition text-sm text-50">
                {@html item.excerpt}
            </div>
        </a>
    {/each}
</DropdownPanel>

<style>
    input:focus {
        outline: 0;
    }
    :global(.search-panel) {
        max-height: calc(100vh - 100px);
        overflow-y: auto;
    }
</style>
