// Friends links data configuration file
// Used to manage data for the friends page
const friendModules = import.meta.glob('../content/friends/*.json', { eager: true });

export interface FriendLink {
    id: string;
    order?: number;
    title: string;
    imgurl: string;
    desc: string;
    siteurl: string;
    tags?: string[];
}

export const friendsData: FriendLink[] = Object.entries(friendModules)
    .map(([path, mod]: [string, any]) => {
        const id = path.split('/').pop()?.replace('.json', '') || '';
        const data = mod.default;
        return { id, ...data } as FriendLink;
    })
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)
        || a.id.localeCompare(b.id));
