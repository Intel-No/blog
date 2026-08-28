<script lang="ts">
    import { onMount } from "svelte";


    type CalendarPost = {
        date: string;
        title: string;
        url: string;
    };

    let { posts = [] }: { posts?: CalendarPost[] } = $props();

    const initialDate = new Date();
    let today = $state(initialDate);
    let viewYear = $state(initialDate.getFullYear());
    let viewMonth = $state(initialDate.getMonth());
    let selectedDate = $state("");

    const weekdays = ["一", "二", "三", "四", "五", "六", "日"];

    const postsByDate = $derived.by(() => {
        const grouped = new Map<string, CalendarPost[]>();
        for (const post of posts) {
            const entries = grouped.get(post.date) || [];
            entries.push(post);
            grouped.set(post.date, entries);
        }
        return grouped;
    });

    const calendarCells = $derived.by(() => {
        const leadingBlankCount = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
        const dayCount = new Date(viewYear, viewMonth + 1, 0).getDate();
        return [
            ...Array.from({ length: leadingBlankCount }, () => null),
            ...Array.from({ length: dayCount }, (_, index) => index + 1),
        ];
    });

    const monthPosts = $derived.by(() => {
        const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-`;
        return posts
            .filter((post) => post.date.startsWith(prefix))
            .toSorted((a, b) => b.date.localeCompare(a.date));
    });

    const isViewingCurrentMonth = $derived(
        viewYear === today.getFullYear() && viewMonth === today.getMonth(),
    );

    function dateKey(day: number): string {
        const month = String(viewMonth + 1).padStart(2, "0");
        const date = String(day).padStart(2, "0");
        return `${viewYear}-${month}-${date}`;
    }

    function getPosts(day: number): CalendarPost[] {
        return postsByDate.get(dateKey(day)) || [];
    }

    function isToday(day: number): boolean {
        return today.getFullYear() === viewYear
            && today.getMonth() === viewMonth
            && today.getDate() === day;
    }

    function selectDate(day: number) {
        selectedDate = dateKey(day);
    }

    function isSelected(day: number): boolean {
        return selectedDate === dateKey(day);
    }

    function changeMonth(offset: number) {
        const nextMonth = new Date(viewYear, viewMonth + offset, 1);
        viewYear = nextMonth.getFullYear();
        viewMonth = nextMonth.getMonth();
        selectedDate = "";
    }

    function returnToToday() {
        const now = new Date();
        today = now;
        viewYear = now.getFullYear();
        viewMonth = now.getMonth();
        selectedDate = "";
    }

    onMount(() => {
        returnToToday();
        const timer = window.setInterval(() => {
            today = new Date();
        }, 60_000);
        return () => window.clearInterval(timer);
    });
</script>

<div class="calendar select-none pb-1" aria-label={`${viewYear}年${viewMonth + 1}月日历`}>
    <div class="calendar-header">
        <div class="calendar-month" aria-live="polite">{viewYear}年 {viewMonth + 1}月</div>
        <div class="calendar-actions">
            {#if !isViewingCurrentMonth}
                <button class="calendar-action calendar-today" type="button" onclick={returnToToday} aria-label="回到今天" title="回到今天">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4.6 9A8 8 0 1 0 7 5.7M4.6 9V4.5M4.6 9h4.5" />
                    </svg>
                </button>
            {/if}
            <button class="calendar-action" type="button" onclick={() => changeMonth(-1)} aria-label="上个月" title="上个月">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button class="calendar-action" type="button" onclick={() => changeMonth(1)} aria-label="下个月" title="下个月">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </button>
        </div>
    </div>

    <div class="calendar-weekdays" aria-hidden="true">
        {#each weekdays as weekday}
            <span>{weekday}</span>
        {/each}
    </div>

    <div class="calendar-days">
        {#each calendarCells as day}
            {#if day === null}
                <span class="calendar-day calendar-blank"></span>
            {:else}
                {@const dayPosts = getPosts(day)}
                <button
                    type="button"
                    class:calendar-current={isToday(day)}
                    class:calendar-selected={isSelected(day)}
                    class:calendar-has-posts={dayPosts.length > 0}
                    class="calendar-day"
                    onclick={() => selectDate(day)}
                    title={dayPosts.length > 0 ? dayPosts.map((post) => post.title).join("\n") : undefined}
                    aria-label={`${viewMonth + 1}月${day}日${dayPosts.length > 0 ? `，${dayPosts.length}篇文章` : ""}${isToday(day) ? "，今天" : ""}`}
                    aria-pressed={isSelected(day)}
                >
                    <span>{day}</span>
                    {#if dayPosts.length > 0}<i aria-hidden="true"></i>{/if}
                </button>
            {/if}
        {/each}
    </div>

    {#if monthPosts.length > 0}
        <div class="calendar-posts" aria-label={`${viewYear}年${viewMonth + 1}月发布的文章`}>
            {#each monthPosts as post}
                <a class="calendar-post" href={post.url} title={post.title}>
                    <span>{post.title}</span>
                    <time datetime={post.date}>{Number(post.date.slice(5, 7))}-{Number(post.date.slice(8, 10))}</time>
                </a>
            {/each}
        </div>
    {/if}
</div>

<style>
    .calendar {
        --calendar-text: rgb(38 38 38 / 78%);
        --calendar-strong: rgb(23 23 23 / 92%);
        color: var(--calendar-text);
    }

    :global(.dark) .calendar {
        --calendar-text: rgb(255 255 255 / 72%);
        --calendar-strong: rgb(255 255 255 / 90%);
    }

    .calendar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        min-height: 2.25rem;
        margin-bottom: 0.6rem;
    }

    .calendar-month {
        color: var(--calendar-strong);
        font-size: 1.05rem;
        font-weight: 700;
        white-space: nowrap;
    }

    .calendar-actions {
        display: flex;
        align-items: center;
        gap: 0.15rem;
    }

    .calendar-action {
        display: inline-flex;
        width: 2rem;
        height: 2rem;
        align-items: center;
        justify-content: center;
        border-radius: 0.6rem;
        color: var(--calendar-text);
        cursor: pointer;
        transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
    }

    .calendar-action:hover {
        color: var(--primary);
        background: var(--btn-plain-bg-hover);
    }

    .calendar-action:active {
        transform: scale(0.92);
    }

    .calendar-action:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 1px;
    }

    .calendar-action svg {
        width: 1.35rem;
        height: 1.35rem;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .calendar-today {
        color: var(--primary);
    }

    .calendar-weekdays,
    .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
    }

    .calendar-weekdays {
        margin-bottom: 0.35rem;
        color: var(--content-meta);
        font-size: 0.8rem;
        font-weight: 600;
        text-align: center;
    }

    .calendar-weekdays span,
    .calendar-day {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2.05rem;
    }

    .calendar-day {
        position: relative;
        appearance: none;
        padding: 0;
        border: 1px solid transparent;
        border-radius: 0.65rem;
        color: var(--calendar-text);
        background: transparent;
        font-size: 0.88rem;
        line-height: 1;
        cursor: pointer;
        transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
    }

    .calendar-day:hover {
        color: var(--primary);
        background: color-mix(in oklch, var(--primary) 12%, transparent);
    }

    .calendar-day:active {
        transform: scale(0.92);
    }

    .calendar-day:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 1px;
    }

    .calendar-current {
        border-color: var(--primary);
        color: var(--primary);
        background: color-mix(in oklch, var(--primary) 10%, transparent);
        font-weight: 700;
    }

    .calendar-selected {
        border-color: var(--primary);
        color: white;
        background: var(--primary);
        font-weight: 700;
        box-shadow: 0 0.3rem 0.8rem color-mix(in oklch, var(--primary) 28%, transparent);
    }

    .calendar-selected:hover {
        color: white;
        background: var(--primary);
    }

    .calendar-has-posts {
        color: var(--calendar-strong);
        font-weight: 700;
    }

    .calendar-has-posts:hover {
        color: var(--primary);
    }

    .calendar-has-posts.calendar-selected,
    .calendar-has-posts.calendar-selected:hover {
        color: white;
    }

    .calendar-has-posts i {
        position: absolute;
        bottom: 0.18rem;
        width: 0.27rem;
        height: 0.27rem;
        border-radius: 999px;
        background: var(--primary);
        box-shadow: 0 0 0.35rem color-mix(in oklch, var(--primary) 50%, transparent);
    }

    .calendar-selected i {
        background: white;
        box-shadow: none;
    }

    .calendar-blank {
        visibility: hidden;
    }

    .calendar-posts {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-top: 0.9rem;
        padding-top: 0.75rem;
        border-top: 1px solid var(--line-divider);
    }

    .calendar-post {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        min-width: 0;
        padding: 0.45rem 0.5rem;
        border-radius: 0.55rem;
        color: var(--calendar-text);
        transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
    }

    .calendar-post:hover {
        color: var(--primary);
        background: var(--btn-plain-bg-hover);
        transform: translateX(0.15rem);
    }

    .calendar-post:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 1px;
    }

    .calendar-post span {
        min-width: 0;
        overflow: hidden;
        font-size: 0.82rem;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .calendar-post time {
        flex: none;
        color: var(--content-meta);
        font-size: 0.75rem;
    }
</style>
